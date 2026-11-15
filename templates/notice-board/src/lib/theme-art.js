// The ready-made post designs: a gradient and an SVG drawn at the size of the region. Keep the names in step with NOTICE_THEMES in dsplay-web-apps.
// A post may carry a ready-made design: a background drawn as an SVG at the size of this region (the art hugs the edges and scales with the shorter side,
// so the same name fits a tall strip, a wide bar and a full screen), with its own text colour. Keep the names in step with NOTICE_THEMES in dsplay-web-apps.
export const THEMES = {
    birthday: ['#be185d', '#6d28d9'],
    notice: ['#1e3a8a', '#0b1f4d'],
    assembly: ['#115e59', '#0f2f3a'],
    elevator: ['#374151', '#111827'],
    maintenance: ['#422006', '#1c1917'],
    celebration: ['#5b21b6', '#9d174d'],
    christmas: ['#991b1b', '#14532d'],
    easter: ['#6d28d9', '#0f766e'],
    junina: ['#c2410c', '#7f1d1d'],
    recycling: ['#166534', '#052e16'],
    water: ['#0369a1', '#082f49'],
    pool: ['#0e7490', '#164e63'],
    security: ['#1e293b', '#020617'],
    health: ['#0f766e', '#134e4a'],
    pets: ['#78350f', '#292524']
};
function f1(n) { return n.toFixed(1); }
function wave(y, amp, len, w, stroke, width, op) {
    var d = 'M0 ' + f1(y);
    for (var x = 0; x < w + len; x += len) d += ' q ' + f1(len / 4) + ' ' + f1(-amp) + ' ' + f1(len / 2) + ' 0 t ' + f1(len / 2) + ' 0';
    return '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + f1(width) + '" stroke-opacity="' + op + '"/>';
}
function drop(cx, cy, r, fill, op) {
    return '<path d="M' + f1(cx) + ' ' + f1(cy - r * 1.6) + ' C' + f1(cx + r * 1.3) + ' ' + f1(cy - r * 0.2) + ' ' + f1(cx + r) + ' ' + f1(cy + r) + ' ' + f1(cx) + ' ' + f1(cy + r) + ' C' + f1(cx - r) + ' ' + f1(cy + r) + ' ' + f1(cx - r * 1.3) + ' ' + f1(cy - r * 0.2) + ' ' + f1(cx) + ' ' + f1(cy - r * 1.6) + 'Z" fill="' + fill + '" opacity="' + op + '"/>';
}
function paw(cx, cy, r, op) {
    var out = '<ellipse cx="' + f1(cx) + '" cy="' + f1(cy + r * 0.3) + '" rx="' + f1(r) + '" ry="' + f1(r * 0.8) + '" fill="#fed7aa" opacity="' + op + '"/>';
    var toes = [[-1.1, -0.9], [-0.4, -1.5], [0.4, -1.5], [1.1, -0.9]];
    for (var t = 0; t < 4; t++) out += '<circle cx="' + f1(cx + toes[t][0] * r) + '" cy="' + f1(cy + toes[t][1] * r) + '" r="' + f1(r * 0.38) + '" fill="#fed7aa" opacity="' + op + '"/>';
    return out;
}
function cross(cx, cy, r, op) {
    return '<rect x="' + f1(cx - r * 0.3) + '" y="' + f1(cy - r) + '" width="' + f1(r * 0.6) + '" height="' + f1(r * 2) + '" rx="' + f1(r * 0.15) + '" fill="#ffffff" opacity="' + op + '"/><rect x="' + f1(cx - r) + '" y="' + f1(cy - r * 0.3) + '" width="' + f1(r * 2) + '" height="' + f1(r * 0.6) + '" rx="' + f1(r * 0.15) + '" fill="#ffffff" opacity="' + op + '"/>';
}
var CONFETTI = ['#fde047', '#5eead4', '#f9a8d4', '#93c5fd', '#fdba74', '#ffffff'];
function rng(seed) { var x = seed; return function () { x = (x * 16807) % 2147483647; return x / 2147483647; }; }
function star(cx, cy, r, fill) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
        var a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r * 0.45 : r;
        pts.push((cx + Math.cos(a) * d).toFixed(1) + ',' + (cy + Math.sin(a) * d).toFixed(1));
    }
    return '<polygon points="' + pts.join(' ') + '" fill="' + fill + '"/>';
}
export function themeArt(name, w, h) {
    var m = Math.min(w, h), r = rng(7), art = '', i;
    // Scattered pieces keep out of the middle band where the text sits: they live in a frame m * 0.16 wide, thicker on the long sides' ends.
    function edgePoint() {
        var side = Math.floor(r() * 4), t = r(), depth = r() * m * 0.16;
        if (side === 0) return [t * w, depth];
        if (side === 1) return [t * w, h - depth];
        if (side === 2) return [depth, t * h];
        return [w - depth, t * h];
    }
    var count = Math.min(70, Math.round((w + h) / m * 16));
    if (name === 'birthday') {
        for (i = 0; i < count; i++) {
            var c = edgePoint(), col = CONFETTI[i % CONFETTI.length], sz = m * (0.012 + r() * 0.018);
            art += i % 2 ? '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + sz.toFixed(1) + '" fill="' + col + '" opacity=".85"/>'
                : '<rect x="' + c[0].toFixed(1) + '" y="' + c[1].toFixed(1) + '" width="' + (sz * 2).toFixed(1) + '" height="' + (sz * 0.8).toFixed(1) + '" fill="' + col + '" opacity=".85" transform="rotate(' + Math.round(r() * 180) + ' ' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ')"/>';
        }
        var bx = [[0.08, '#fde047'], [0.15, '#5eead4'], [0.92, '#f9a8d4'], [0.85, '#93c5fd']];
        for (i = 0; i < bx.length; i++) {
            var bw = m * 0.085, bh = bw * 1.25, x = w * bx[i][0], y = h - m * 0.2 - (i % 2) * m * 0.05;
            art += '<line x1="' + x.toFixed(1) + '" y1="' + (y + bh).toFixed(1) + '" x2="' + (x + (i < 2 ? 1 : -1) * bw * 0.3).toFixed(1) + '" y2="' + (h + 4) + '" stroke="#ffffff" stroke-opacity=".6" stroke-width="' + Math.max(1, m * 0.004).toFixed(1) + '"/>'
                + '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + bw.toFixed(1) + '" ry="' + bh.toFixed(1) + '" fill="' + bx[i][1] + '" opacity=".9"/>';
        }
    } else if (name === 'notice') {
        var band = m * 0.07, stripe = band * 1.4;
        art += '<rect x="0" y="0" width="' + w + '" height="' + band.toFixed(1) + '" fill="#fbbf24"/>';
        for (i = -2; i < w / stripe + 2; i++) art += '<polygon points="' + (i * stripe).toFixed(1) + ',0 ' + (i * stripe + stripe / 2).toFixed(1) + ',0 ' + (i * stripe + stripe / 2 - band).toFixed(1) + ',' + band.toFixed(1) + ' ' + (i * stripe - band).toFixed(1) + ',' + band.toFixed(1) + '" fill="#1c1917" opacity=".85"/>';
        var tri = m * 0.2, tx = w - tri * 1.2, ty = h - tri * 1.1;
        art += '<polygon points="' + (tx + tri / 2).toFixed(1) + ',' + ty.toFixed(1) + ' ' + (tx + tri).toFixed(1) + ',' + (ty + tri * 0.87).toFixed(1) + ' ' + tx.toFixed(1) + ',' + (ty + tri * 0.87).toFixed(1) + '" fill="#fbbf24" opacity=".9"/>'
            + '<rect x="' + (tx + tri / 2 - tri * 0.03).toFixed(1) + '" y="' + (ty + tri * 0.3).toFixed(1) + '" width="' + (tri * 0.06).toFixed(1) + '" height="' + (tri * 0.32).toFixed(1) + '" fill="#1c1917"/>'
            + '<circle cx="' + (tx + tri / 2).toFixed(1) + '" cy="' + (ty + tri * 0.72).toFixed(1) + '" r="' + (tri * 0.04).toFixed(1) + '" fill="#1c1917"/>';
    } else if (name === 'assembly') {
        var pr = m * 0.045, py = h - m * 0.05, n = Math.max(4, Math.round(w / (pr * 3.2)));
        for (i = 0; i < n; i++) {
            var px = (i + 0.5) * w / n, shade = i % 2 ? '#5eead4' : '#99f6e4';
            art += '<circle cx="' + px.toFixed(1) + '" cy="' + (py - pr * 2.2).toFixed(1) + '" r="' + pr.toFixed(1) + '" fill="' + shade + '" opacity=".35"/>'
                + '<rect x="' + (px - pr * 1.3).toFixed(1) + '" y="' + (py - pr * 1.1).toFixed(1) + '" width="' + (pr * 2.6).toFixed(1) + '" height="' + (pr * 2.4).toFixed(1) + '" rx="' + pr.toFixed(1) + '" fill="' + shade + '" opacity=".35"/>';
        }
        var bw2 = m * 0.16, bh2 = bw2 * 0.7;
        art += '<rect x="' + (w - bw2 * 1.3).toFixed(1) + '" y="' + (m * 0.05).toFixed(1) + '" width="' + bw2.toFixed(1) + '" height="' + bh2.toFixed(1) + '" rx="' + (bw2 * 0.15).toFixed(1) + '" fill="#ffffff" opacity=".18"/>'
            + '<rect x="' + (m * 0.05).toFixed(1) + '" y="' + (m * 0.12).toFixed(1) + '" width="' + (bw2 * 0.8).toFixed(1) + '" height="' + (bh2 * 0.8).toFixed(1) + '" rx="' + (bw2 * 0.15).toFixed(1) + '" fill="#ffffff" opacity=".12"/>';
    } else if (name === 'elevator') {
        var gap = Math.max(2, m * 0.006);
        art += '<rect x="' + (w / 2 - gap).toFixed(1) + '" y="0" width="' + (gap * 2).toFixed(1) + '" height="' + h + '" fill="#000000" opacity=".45"/>'
            + '<rect x="0" y="0" width="' + (w / 2 - gap).toFixed(1) + '" height="' + h + '" fill="#ffffff" opacity=".05"/>';
        var ar = m * 0.05, ax = w - m * 0.09, ay = m * 0.09;
        art += '<circle cx="' + ax.toFixed(1) + '" cy="' + (ay + ar * 0.2).toFixed(1) + '" r="' + (ar * 1.9).toFixed(1) + '" fill="#000000" opacity=".4"/>'
            + '<polygon points="' + ax.toFixed(1) + ',' + (ay - ar).toFixed(1) + ' ' + (ax + ar).toFixed(1) + ',' + ay.toFixed(1) + ' ' + (ax - ar).toFixed(1) + ',' + ay.toFixed(1) + '" fill="#fbbf24"/>'
            + '<polygon points="' + ax.toFixed(1) + ',' + (ay + ar * 1.4).toFixed(1) + ' ' + (ax + ar).toFixed(1) + ',' + (ay + ar * 0.4).toFixed(1) + ' ' + (ax - ar).toFixed(1) + ',' + (ay + ar * 0.4).toFixed(1) + '" fill="#fbbf24" opacity=".5"/>';
        art += '<rect x="' + (w * 0.04).toFixed(1) + '" y="' + (h - m * 0.07).toFixed(1) + '" width="' + (w * 0.92).toFixed(1) + '" height="' + (m * 0.012).toFixed(1) + '" fill="#9ca3af" opacity=".5"/>';
    } else if (name === 'maintenance') {
        var hb = m * 0.06, hs = hb * 1.6;
        for (var k = 0; k < 2; k++) {
            var y0 = k ? h - hb : 0;
            art += '<rect x="0" y="' + y0.toFixed(1) + '" width="' + w + '" height="' + hb.toFixed(1) + '" fill="#facc15"/>';
            for (i = -2; i < w / hs + 2; i++) art += '<polygon points="' + (i * hs).toFixed(1) + ',' + (y0 + hb).toFixed(1) + ' ' + (i * hs + hs / 2).toFixed(1) + ',' + (y0 + hb).toFixed(1) + ' ' + (i * hs + hs / 2 + hb).toFixed(1) + ',' + y0.toFixed(1) + ' ' + (i * hs + hb).toFixed(1) + ',' + y0.toFixed(1) + '" fill="#1c1917"/>';
        }
        var gr = m * 0.12, gx = w - gr * 1.4, gy = hb + gr * 1.3;
        art += '<circle cx="' + gx.toFixed(1) + '" cy="' + gy.toFixed(1) + '" r="' + gr.toFixed(1) + '" fill="none" stroke="#facc15" stroke-opacity=".5" stroke-width="' + (gr * 0.28).toFixed(1) + '" stroke-dasharray="' + (gr * 0.45).toFixed(1) + ' ' + (gr * 0.25).toFixed(1) + '"/>'
            + '<circle cx="' + gx.toFixed(1) + '" cy="' + gy.toFixed(1) + '" r="' + (gr * 0.55).toFixed(1) + '" fill="none" stroke="#facc15" stroke-opacity=".5" stroke-width="' + (gr * 0.12).toFixed(1) + '"/>';
    } else if (name === 'celebration') {
        for (i = 0; i < count; i++) {
            var q = edgePoint(), sr = m * (0.012 + r() * 0.03);
            art += i % 3 ? star(q[0], q[1], sr * 1.4, CONFETTI[i % CONFETTI.length]).replace('/>', ' opacity=".85"/>')
                : '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + (sr * 0.5).toFixed(1) + '" fill="#ffffff" opacity=".7"/>';
        }
        var corners = [[0, 0], [w, 0]];
        for (i = 0; i < 2; i++) for (var ray = 0; ray < 9; ray++) {
            var ang = ray * (Math.PI / 2 / 8), len = m * 0.3;
            art += '<line x1="' + corners[i][0] + '" y1="' + corners[i][1] + '" x2="' + (corners[i][0] + Math.cos(ang) * len * (i ? -1 : 1)).toFixed(1) + '" y2="' + (corners[i][1] + Math.sin(ang) * len).toFixed(1) + '" stroke="#fde047" stroke-opacity=".35" stroke-width="' + Math.max(1, m * 0.006).toFixed(1) + '"/>';
        }
    }
    else if (name === 'christmas') {
        for (i = 0; i < count; i++) { var sn = edgePoint(); art += '<circle cx="' + f1(sn[0]) + '" cy="' + f1(sn[1]) + '" r="' + f1(m * (0.006 + r() * 0.012)) + '" fill="#ffffff" opacity=".8"/>'; }
        for (i = 0; i < 2; i++) {
            var tw = m * 0.16, tx0 = i ? w - tw * 1.3 : tw * 0.3, base = h - m * 0.03;
            for (var lv = 0; lv < 3; lv++) {
                var lw = tw * (1 - lv * 0.25), ly = base - m * 0.03 - lv * tw * 0.4;
                art += '<polygon points="' + f1(tx0 + tw / 2) + ',' + f1(ly - tw * 0.55) + ' ' + f1(tx0 + tw / 2 + lw / 2) + ',' + f1(ly) + ' ' + f1(tx0 + tw / 2 - lw / 2) + ',' + f1(ly) + '" fill="#22c55e" opacity=".85"/>';
            }
            art += '<rect x="' + f1(tx0 + tw * 0.44) + '" y="' + f1(base - m * 0.03) + '" width="' + f1(tw * 0.12) + '" height="' + f1(m * 0.03) + '" fill="#92400e"/>' + star(tx0 + tw / 2, base - m * 0.03 - tw * 1.35, tw * 0.09, '#fde047');
        }
    } else if (name === 'easter') {
        var eg = [[0.07, '#fde047', '#f472b6'], [0.14, '#f9a8d4', '#fde047'], [0.9, '#93c5fd', '#fde047'], [0.83, '#fde047', '#93c5fd']];
        for (i = 0; i < eg.length; i++) {
            var er = m * 0.065, ex = w * eg[i][0], ey = h - er * 1.5 - (i % 2) * er * 0.5;
            art += '<ellipse cx="' + f1(ex) + '" cy="' + f1(ey) + '" rx="' + f1(er) + '" ry="' + f1(er * 1.3) + '" fill="' + eg[i][1] + '" opacity=".92"/>'
                + '<rect x="' + f1(ex - er) + '" y="' + f1(ey - er * 0.2) + '" width="' + f1(er * 2) + '" height="' + f1(er * 0.3) + '" fill="' + eg[i][2] + '" opacity=".8"/>';
        }
        for (i = 0; i < count; i++) { var fl = edgePoint(); art += '<circle cx="' + f1(fl[0]) + '" cy="' + f1(fl[1]) + '" r="' + f1(m * (0.008 + r() * 0.01)) + '" fill="' + CONFETTI[i % CONFETTI.length] + '" opacity=".6"/>'; }
    } else if (name === 'junina') {
        var fw = Math.max(m * 0.07, 24), fn = Math.ceil(w / fw), flagColors = ['#fde047', '#22c55e', '#38bdf8', '#f472b6', '#ffffff'];
        art += '<path d="M0 ' + f1(m * 0.02) + ' Q' + f1(w / 2) + ' ' + f1(m * 0.09) + ' ' + w + ' ' + f1(m * 0.02) + '" fill="none" stroke="#fef3c7" stroke-opacity=".7" stroke-width="' + f1(Math.max(1, m * 0.004)) + '"/>';
        for (i = 0; i < fn; i++) {
            var fx = i * fw, fy = m * 0.02 + 4 * (m * 0.07) * ((i + 0.5) / fn) * (1 - (i + 0.5) / fn);
            art += '<polygon points="' + f1(fx) + ',' + f1(fy) + ' ' + f1(fx + fw * 0.9) + ',' + f1(fy) + ' ' + f1(fx + fw * 0.45) + ',' + f1(fy + fw * 1.1) + '" fill="' + flagColors[i % flagColors.length] + '" opacity=".9"/>';
        }
        for (i = 0; i < count / 2; i++) { var sp = edgePoint(); art += star(sp[0], sp[1], m * 0.012, '#fde047').replace('/>', ' opacity=".7"/>'); }
    } else if (name === 'recycling') {
        var binW = m * 0.07, binCols = ['#3b82f6', '#22c55e', '#eab308'];
        for (i = 0; i < 3; i++) {
            var bxx = w - m * 0.04 - (3 - i) * binW * 1.25, byy = h - m * 0.03 - binW * 1.5;
            art += '<rect x="' + f1(bxx) + '" y="' + f1(byy) + '" width="' + f1(binW) + '" height="' + f1(binW * 1.5) + '" rx="' + f1(binW * 0.1) + '" fill="' + binCols[i] + '" opacity=".9"/><rect x="' + f1(bxx - binW * 0.06) + '" y="' + f1(byy - binW * 0.12) + '" width="' + f1(binW * 1.12) + '" height="' + f1(binW * 0.14) + '" rx="' + f1(binW * 0.05) + '" fill="#ffffff" opacity=".6"/>';
        }
        var rr = m * 0.1;
        art += '<circle cx="' + f1(rr * 1.5) + '" cy="' + f1(rr * 1.5) + '" r="' + f1(rr) + '" fill="none" stroke="#86efac" stroke-opacity=".5" stroke-width="' + f1(rr * 0.22) + '" stroke-dasharray="' + f1(rr * 1.6) + ' ' + f1(rr * 0.45) + '"/>';
    } else if (name === 'water') {
        art += wave(h - m * 0.05, m * 0.03, m * 0.2, w, '#7dd3fc', m * 0.012, 0.6) + wave(h - m * 0.1, m * 0.025, m * 0.26, w, '#bae6fd', m * 0.01, 0.4);
        for (i = 0; i < count / 2; i++) { var dp = edgePoint(); art += drop(dp[0], dp[1], m * (0.012 + r() * 0.018), '#bae6fd', 0.7); }
    } else if (name === 'pool') {
        art += wave(h - m * 0.04, m * 0.03, m * 0.22, w, '#a5f3fc', m * 0.012, 0.6) + wave(h - m * 0.09, m * 0.03, m * 0.22, w, '#67e8f9', m * 0.01, 0.45) + wave(m * 0.06, m * 0.025, m * 0.22, w, '#a5f3fc', m * 0.01, 0.4);
        var rope = Math.max(10, m * 0.03);
        for (i = 0; i < w / (rope * 1.6); i++) art += '<circle cx="' + f1(i * rope * 1.6 + rope) + '" cy="' + f1(m * 0.13) + '" r="' + f1(rope * 0.5) + '" fill="' + (i % 2 ? '#ef4444' : '#ffffff') + '" opacity=".7"/>';
    } else if (name === 'security') {
        var sh = m * 0.2, sx = w - sh * 1.2, sy = m * 0.06;
        art += '<path d="M' + f1(sx + sh / 2) + ' ' + f1(sy) + ' L' + f1(sx + sh) + ' ' + f1(sy + sh * 0.2) + ' L' + f1(sx + sh) + ' ' + f1(sy + sh * 0.65) + ' Q' + f1(sx + sh) + ' ' + f1(sy + sh * 1.05) + ' ' + f1(sx + sh / 2) + ' ' + f1(sy + sh * 1.2) + ' Q' + f1(sx) + ' ' + f1(sy + sh * 1.05) + ' ' + f1(sx) + ' ' + f1(sy + sh * 0.65) + ' L' + f1(sx) + ' ' + f1(sy + sh * 0.2) + 'Z" fill="#38bdf8" opacity=".35"/>'
            + '<polyline points="' + f1(sx + sh * 0.28) + ',' + f1(sy + sh * 0.6) + ' ' + f1(sx + sh * 0.45) + ',' + f1(sy + sh * 0.78) + ' ' + f1(sx + sh * 0.74) + ',' + f1(sy + sh * 0.42) + '" fill="none" stroke="#e0f2fe" stroke-width="' + f1(sh * 0.07) + '" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>';
        for (i = 0; i < 4; i++) art += '<rect x="' + f1(m * 0.04 + i * m * 0.035) + '" y="' + f1(h - m * 0.06) + '" width="' + f1(m * 0.012) + '" height="' + f1(m * 0.03) + '" fill="#38bdf8" opacity="' + f1(0.7 - i * 0.15) + '"/>';
    } else if (name === 'health') {
        for (i = 0; i < count / 2; i++) { var cp = edgePoint(); art += cross(cp[0], cp[1], m * (0.014 + r() * 0.02), 0.55); }
        var by = h - m * 0.07, hb2 = m * 0.04, pts = '0,' + f1(by), step = Math.max(m * 0.12, 40);
        for (var hx = 0; hx < w; hx += step) pts += ' ' + f1(hx + step * 0.3) + ',' + f1(by) + ' ' + f1(hx + step * 0.4) + ',' + f1(by - hb2) + ' ' + f1(hx + step * 0.5) + ',' + f1(by + hb2 * 1.4) + ' ' + f1(hx + step * 0.6) + ',' + f1(by) + ' ' + f1(hx + step) + ',' + f1(by);
        art += '<polyline points="' + pts + '" fill="none" stroke="#5eead4" stroke-width="' + f1(Math.max(2, m * 0.007)) + '" opacity=".7"/>';
    } else if (name === 'pets') {
        for (i = 0; i < Math.max(4, count / 4); i++) { var pp = edgePoint(); art += paw(pp[0], pp[1], m * (0.014 + r() * 0.016), 0.4); }
        art += paw(w - m * 0.12, h - m * 0.1, m * 0.06, 0.55) + paw(m * 0.1, m * 0.1, m * 0.045, 0.4);
    }
    var g = THEMES[name];
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + g[0] + '"/><stop offset="1" stop-color="' + g[1] + '"/></linearGradient></defs><rect width="' + w + '" height="' + h + '" fill="url(#g)"/>' + art + '</svg>';
}

// The room each design's art takes on every side, as a share of the region's shorter side: the post's margin is at least this, so the text never runs over a band,
// a picture or a corner drawing; a design that scatters pieces over its edge (confetti, stars, drops) keeps 13% clear. Measured from `themeArt` above; change both together.
export const THEME_INSETS = {
  birthday: { top: 0.13, right: 0.13, bottom: 0.3, left: 0.13 },
  notice: { top: 0.1, right: 0.08, bottom: 0.22, left: 0.08 },
  assembly: { top: 0.12, right: 0.2, bottom: 0.2, left: 0.2 },
  elevator: { top: 0.12, right: 0.2, bottom: 0.1, left: 0.08 },
  maintenance: { top: 0.1, right: 0.3, bottom: 0.1, left: 0.06 },
  celebration: { top: 0.13, right: 0.13, bottom: 0.13, left: 0.13 },
  christmas: { top: 0.13, right: 0.22, bottom: 0.13, left: 0.22 },
  easter: { top: 0.13, right: 0.13, bottom: 0.22, left: 0.13 },
  junina: { top: 0.2, right: 0.13, bottom: 0.13, left: 0.13 },
  recycling: { top: 0.1, right: 0.3, bottom: 0.16, left: 0.26 },
  water: { top: 0.13, right: 0.13, bottom: 0.16, left: 0.13 },
  pool: { top: 0.17, right: 0.06, bottom: 0.14, left: 0.06 },
  security: { top: 0.1, right: 0.26, bottom: 0.1, left: 0.08 },
  health: { top: 0.13, right: 0.13, bottom: 0.14, left: 0.13 },
  pets: { top: 0.17, right: 0.2, bottom: 0.2, left: 0.17 },
};
