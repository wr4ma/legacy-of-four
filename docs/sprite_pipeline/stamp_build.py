# Jalankan SEBELUM membuat update ZIP: menulis assets/build.json (id build + daftar modul) agar cache browser ter-reset setelah deploy.
import json, glob, time
json.dump({'build': time.strftime('%Y%m%d-%H%M%S'), 'modules': sorted(glob.glob('src/*.js'))}, open('assets/build.json', 'w'), indent=1)
