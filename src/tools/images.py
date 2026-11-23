#!/usr/bin/env python3
"""Image pipeline: turns the original (legacy) photos into small, web-ready WebP files in /assets/img.

    python3 src/tools/images.py            # build anything missing or out of date
    python3 src/tools/images.py --force    # rebuild everything

Needs `cwebp` (brew install webp) and macOS `sips`. The generated files are committed, so you only
need to run this when you add or change a photo. To add a doctor photo, add a line to DOCTORS below.

Crop boxes are (cx, cy, size): the centre of the crop as a fraction of the image width/height, and the
crop's side as a fraction of the image's shorter side. Doctor photos are cropped square around the face.
"""
import os, struct, subprocess, sys, tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'assets', 'img')
FORCE = '--force' in sys.argv

EC = 'electroniccity/images'
ECG = 'electroniccity/images/hospitals photos for gallary'
ECX = 'electroniccity/img_for_child_blogs_and_speciality'
KU = 'kudlu/img'

# id: (source, (cx, cy, size))
DOCTORS = {
    'dayanand-yaligar':   (f'{EC}/doc4.jpeg',  (.50, .48, .96)),
    'shrilakshmi':        (f'{EC}/doc14.jpeg', (.56, .46, .72)),
    'chandan-s':          (f'{EC}/doc6.png',   (.50, .38, .76)),
    'aj-babu':            (f'{EC}/doc17.jpeg', (.40, .38, .74)),
    'nanda-kishore':      (f'{EC}/doc1.jpeg',  (.50, .42, .84)),
    'sudeep-kumar':       (f'{EC}/doc12.jpeg', (.47, .44, .88)),
    'narasimhaiah-k':     (f'{EC}/doc16.webp', (.50, .42, .84)),
    'deepak-mr':          (f'{EC}/doc10.png',  (.50, .42, .70)),
    'arti-priya':         (f'{EC}/doc15.jpeg', (.50, .34, .52)),
    'navya':              (f'{EC}/doc11.jpeg', (.65, .70, .56)),
    'manojith-ss':        (f'{EC}/doc7.jpeg',  (.50, .40, .90)),
    'srivachan-shapur':   (f'{EC}/doc9.jpeg',  (.42, .44, .80)),
    'prarthana-patil':    (f'{EC}/doc18.jpeg', (.48, .40, .90)),
    'sushma-s':           (f'{EC}/doc19.jpeg', (.47, .42, .90)),
    'harshita':           (f'{EC}/doc5.jpeg',  (.50, .44, .92)),
    'madhu-sekhar':       (f'{EC}/doc8.jpeg',  (.48, .40, .90)),
    # leadership
    'ravindra-s':         (f'{EC}/dr-ravi.jpeg',      (.59, .50, .96)),
    'nanda-gowda':        (f'{EC}/dr-nanda.jpeg',     (.50, .49, .68)),
    'chandru':            (f'{EC}/dr. chandru.jpeg',  (.47, .40, .74)),
    'tilak-kumar':        (f'{KU}/doc8.jpeg',         (.42, .44, .80)),
    'bhavya-gowda':       (f'{KU}/doc13jpg.jpg',      (.50, .42, 1.0)),
}

# output (without extension): (source, max width, optional crop box (x0, y0, x1, y1) as fractions)
PHOTOS = {
    # Electronic City
    'ec/reception':       (f'{EC}/slidingImage1.jpeg', 1600, None),
    'ec/front-desk':      (f'{ECG}/img14.JPG', 1600, None),
    'ec/building':        (f'{ECG}/img3.jpeg', 1200, None),
    'ec/signboard':       (f'{ECG}/img1.jpeg', 1200, None),
    'ec/corridor':        (f'{ECG}/img12.jpeg', 1200, None),
    'ec/patient-room':    (f'{ECG}/img10.jpeg', 1600, None),
    'ec/consult-room-1':  (f'{ECG}/img5.jpeg', 1600, None),
    'ec/consult-room-2':  (f'{ECG}/img16.JPG', 1600, None),
    'ec/consult-room-3':  (f'{ECG}/img9.jpeg', 1600, None),
    'ec/ot-1':            (f'{ECG}/img2.jpeg', 1600, None),
    'ec/ot-2':            (f'{ECG}/img7.jpeg', 1600, None),
    'ec/ward-1':          (f'{ECG}/img4.jpeg', 1600, None),
    'ec/icu':             (f'{ECG}/img8.jpeg', 1600, None),
    'ec/ward-2':          (f'{ECG}/img6.jpeg', 1600, None),
    'ec/nicu':            (f'{ECG}/img11.jpeg', 1200, None),
    'ec/lab':             (f'{ECG}/img13.JPG', 1600, None),
    # Kudlu
    'kudlu/ot':               (f'{KU}/abt1.jpg', 1600, None),
    'kudlu/team':             (f'{KU}/abt2.jpg', 1200, None),
    'kudlu/reception':        (f'{KU}/abt3.jpg', 1600, None),
    'kudlu/lounge':           (f'{KU}/abt4.jpg', 1600, None),
    'kudlu/nursing-station':  (f'{KU}/abt5.jpg', 1600, None),
    'kudlu/front-desk':       (f'{KU}/abt6.jpg', 1600, None),
    'kudlu/signage':          (f'{KU}/abt7.jpg', 1200, None),
    'kudlu/pharmacy':         (f'{KU}/abt8.jpg', 1600, None),
    'kudlu/corridor':         (f'{KU}/abt9.jpg', 1600, None),
    # Kudlu clinical work ("Insights"). X-ray films are cropped to remove the strip that carries the
    # patient's name, age, ID and date - never publish those.
    'kudlu/insights/knee-replacement-xray':  (f'{KU}/inj1.jpeg', 900, (0, 0, 1, .935)),
    'kudlu/insights/knee-surgery':           (f'{KU}/inj2.jpeg', 1200, None),
    'kudlu/insights/post-op-rounds':         (f'{KU}/inj7.jpeg', 1200, None),
    'kudlu/insights/plate-fixation-xray':    (f'{KU}/inj4.jpeg', 1100, (0, 0, 1, .93)),
    'kudlu/insights/tibial-nailing-xray':    (f'{KU}/inj5.jpeg', 1400, (0, 0, 1, .80)),
    'kudlu/insights/intra-operative-1':      (f'{KU}/inj6.jpeg', 1100, None),
    'kudlu/insights/knee-joint-findings':    (f'{KU}/ing3.jpeg', 1200, None),
    'kudlu/insights/ward-rounds':            (f'{KU}/inj8.jpeg', 1200, None),
    'kudlu/insights/intra-operative-2':      (f'{KU}/inj9.jpeg', 1200, None),
}

BLOG_COVERS = ['heart', 'tatv', 'stresss', 'cancer', 'cardiac', 'cardiomaphy', 'childHealth', 'cognetial', 'cronory',
               'Dyslipidaemia', 'echocardiogram', 'exercize', 'kidney', 'prostatitis', 'pumpingLife', 'stress', 'dvt',
               'uthral', 'uti', 'ffr']


def run(*cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f'FAILED: {" ".join(cmd)}\n{r.stderr or r.stdout}')
    return r.stdout


def size(path):
    out = run('sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path).split()
    return int(out[-3]), int(out[-1])


def exif_orientation(path):
    """Return the EXIF orientation (1-8) of a JPEG, or 1."""
    try:
        with open(path, 'rb') as f:
            d = f.read(256 * 1024)
        if d[:2] != b'\xff\xd8':
            return 1
        i = 2
        while i + 4 < len(d):
            if d[i] != 0xFF:
                return 1
            marker, ln = d[i + 1], struct.unpack('>H', d[i + 2:i + 4])[0]
            if marker == 0xE1 and d[i + 4:i + 10] == b'Exif\x00\x00':
                t = i + 10
                e = '<' if d[t:t + 2] == b'II' else '>'
                off = struct.unpack(e + 'I', d[t + 4:t + 8])[0]
                n = struct.unpack(e + 'H', d[t + off:t + off + 2])[0]
                for k in range(n):
                    p = t + off + 2 + k * 12
                    if struct.unpack(e + 'H', d[p:p + 2])[0] == 0x0112:
                        return struct.unpack(e + 'H', d[p + 8:p + 10])[0]
                return 1
            if marker == 0xDA:
                return 1
            i += 2 + ln
    except Exception:
        pass
    return 1


def upright(src):
    """cwebp ignores EXIF rotation, so bake it in first when needed. Returns a path to read from."""
    o = exif_orientation(src)
    deg = {3: 180, 6: 90, 8: 270}.get(o)
    if not deg:
        return src
    tmp = os.path.join(tempfile.gettempdir(), 'raksha-upright-' + os.path.basename(src) + '.png')
    run('sips', '-s', 'format', 'png', '-r', str(deg), src, '--out', tmp)
    return tmp


def stale(src, dst):
    return FORCE or not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src)


def webp(src, dst, width=None, crop=None, q=78, alpha=False):
    """crop = (x, y, w, h) in pixels of the upright source."""
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    cmd = ['cwebp', '-quiet', '-m', '6', '-q', str(q)]
    if alpha:
        cmd += ['-alpha_q', '100', '-exact']
    if crop:
        cmd += ['-crop'] + [str(int(v)) for v in crop]
    if width:
        cmd += ['-resize', str(int(width)), '0']
    run(*cmd, src, '-o', dst)


def photo(key, spec):
    src_rel, maxw, box = spec
    src = os.path.join(ROOT, src_rel)
    big = os.path.join(OUT, key + '.webp'); small = os.path.join(OUT, key + '-sm.webp')
    if not (stale(src, big) or stale(src, small)):
        return
    up = upright(src); w, h = size(up)
    crop = None; cw = w
    if box:
        x0, y0, x1, y1 = box
        crop = (round(w * x0), round(h * y0), round(w * (x1 - x0)), round(h * (y1 - y0))); cw = crop[2]
    webp(up, big, min(maxw, cw), crop, q=76)
    webp(up, small, min(720, cw), crop, q=72)
    print('photo ', key)


def doctor(key, spec):
    src_rel, (cx, cy, s) = spec
    src = os.path.join(ROOT, src_rel); dst = os.path.join(OUT, 'doctors', key + '.webp')
    if not stale(src, dst):
        return
    up = upright(src); w, h = size(up)
    side = round(min(w, h) * s)
    x = min(max(round(w * cx - side / 2), 0), w - side); y = min(max(round(h * cy - side / 2), 0), h - side)
    webp(up, dst, min(440, side), (x, y, side, side), q=82)
    print('doctor', key)


def brand():
    b = os.path.join(OUT, 'brand'); os.makedirs(b, exist_ok=True)
    wide = os.path.join(ROOT, ECX, 'R_logo_background_Less.png')
    mark = os.path.join(ROOT, ECX, 'Raksha_logo-Photoroom-removebg-preview.png')
    solid = os.path.join(ROOT, EC, 'bannerName.png')
    if stale(wide, os.path.join(b, 'logo.webp')):
        webp(wide, os.path.join(b, 'logo.webp'), 600, q=92, alpha=True); print('brand  logo.webp')
    if stale(mark, os.path.join(b, 'mark.webp')):
        webp(mark, os.path.join(b, 'mark.webp'), 240, q=92, alpha=True); print('brand  mark.webp')
    if stale(solid, os.path.join(b, 'logo.png')):
        run('sips', '-Z', '800', solid, '--out', os.path.join(b, 'logo.png')); print('brand  logo.png')
    icon_src = os.path.join(ROOT, ECX, 'onlylogo.png')
    for name, px in (('apple-touch-icon.png', 180), ('icon-192.png', 192), ('favicon-32.png', 32)):
        dst = os.path.join(b, name)
        if stale(icon_src, dst):
            # pad the 378x410 mark to a square first so it is not stretched
            tmp = os.path.join(tempfile.gettempdir(), 'raksha-icon-square.png')
            run('sips', '-p', '430', '430', '--padColor', 'FFFFFF', icon_src, '--out', tmp)
            run('sips', '-z', str(px), str(px), tmp, '--out', dst); print('brand ', name)
    ico = os.path.join(ROOT, EC, 'raksha2_logo.ico')
    for dst in (os.path.join(ROOT, 'favicon.ico'),):
        if stale(ico, dst):
            run('cp', ico, dst); print('brand  favicon.ico')


def blog_covers():
    for name in BLOG_COVERS:
        src = os.path.join(ROOT, KU, name + '.webp')
        big = os.path.join(OUT, 'blog', name.lower() + '.webp'); small = os.path.join(OUT, 'blog', name.lower() + '-sm.webp')
        if stale(src, big) or stale(src, small):
            webp(src, big, 1280, q=74); webp(src, small, 640, q=70); print('blog  ', name.lower())


if __name__ == '__main__':
    brand()
    for k, v in DOCTORS.items(): doctor(k, v)
    for k, v in PHOTOS.items(): photo(k, v)
    blog_covers()
    total = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fn in os.walk(OUT) for f in fn)
    print(f'assets/img total: {total / 1e6:.1f} MB')
