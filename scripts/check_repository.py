"""Small repository-content guard; not a replacement for secret scanning."""
import re
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
files = subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0')
errors = []
blocked = {'.pem', '.key', '.pfx', '.p12', '.pak', '.utoc', '.ucas', '.fwpak', '.zip'}
for name in filter(None, files):
    path = root / name
    if path.is_symlink():
        errors.append(f'{name}: symbolic links require explicit policy review')
        continue
    if path.suffix.lower() in blocked or (path.name.startswith('.env') and path.name != '.env.example'):
        errors.append(f'{name}: prohibited artifact')
    if any(part in {'admin-private', 'runtime-private', 'backups', 'logs'} for part in path.parts):
        errors.append(f'{name}: private runtime directory')
    if path.stat().st_size > 1_000_000:
        errors.append(f'{name}: exceeds source-file size limit')
    if name.startswith('.github/workflows/'):
        text = path.read_text(encoding='utf-8')
        for ref in re.findall(r'uses:\s*([^\s#]+)', text):
            if not re.fullmatch(r'[\w.-]+/[\w./-]+@[0-9a-f]{40}', ref):
                errors.append(f'{name}: action must use a full commit hash')
        if 'pull_request_target:' in text:
            errors.append(f'{name}: privileged PR trigger requires separate security design')
for required in ('README.md', 'LICENSE', 'SECURITY.md', 'CONTRIBUTING.md', '.github/CODEOWNERS'):
    if not (root / required).is_file():
        errors.append(f'Missing {required}')
if errors:
    raise SystemExit('\n'.join(errors))
print('Repository policy checks passed. Gameplay implementation not yet present.')
