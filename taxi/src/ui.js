export const W = 390;
export const H = 693;

export const reduced = typeof matchMedia === 'function'
  && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ms(duration) {
  return reduced ? Math.min(24, duration) : duration;
}

export function announce(screen, detail = '') {
  if (typeof document === 'undefined') return;
  document.body.dataset.screen = screen;
  const live = document.getElementById('live');
  if (live) live.textContent = detail || screen;
}

export function font(size, extra = {}) {
  return {
    fontFamily: extra.family || 'Fredoka, sans-serif',
    fontSize: `${size}px`,
    color: extra.color || '#3B2416',
    align: extra.align || 'center',
    resolution: 2,
    wordWrap: extra.wrap ? { width: extra.wrap, useAdvancedWrap: true } : undefined,
  };
}

export function tween(scene, targets, props) {
  const duration = ms(props.duration ?? 200);
  return new Promise((resolve) => {
    scene.tweens.add({
      ...props,
      targets,
      duration,
      onComplete: () => resolve(),
    });
  });
}

export function stickerButton(scene, x, y, w, h, label, onClick, opts = {}) {
  const root = scene.add.container(x, y);
  const g = scene.add.graphics();
  const radius = opts.radius ?? 18;
  const fill = opts.fill ?? 0xfff6e4;
  g.fillStyle(0x3b2416, 0.16);
  g.fillRoundedRect(-w / 2 + 3, -h / 2 + 4, w, h, radius);
  g.fillStyle(fill, 1);
  g.fillRoundedRect(-w / 2, -h / 2, w, h, radius);
  g.lineStyle(4, 0x3b2416, 1);
  g.strokeRoundedRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2, radius);
  const kids = [g];
  let icon = null;
  if (opts.icon) {
    icon = scene.add.image(0, label ? -12 : 0, opts.icon).setDisplaySize(opts.iconSize ?? 28, opts.iconSize ?? 28);
    kids.push(icon);
  }
  const text = scene.add.text(0, opts.icon && label ? 16 : 0, label, font(opts.size ?? (label.length > 12 ? 18 : 24))).setOrigin(0.5);
  kids.push(text);
  root.add(kids);
  const hit = scene.add.rectangle(0, 0, w, h, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
  root.add(hit);
  let enabled = opts.enabled !== false;
  let down = false;
  const press = (on) => {
    if (!reduced) root.setScale(on ? 0.96 : 1);
  };
  hit.on('pointerdown', () => {
    if (!enabled) return;
    down = true;
    press(true);
  });
  hit.on('pointerup', () => {
    if (!down) return;
    down = false;
    press(false);
    if (enabled) onClick();
    else if (opts.onDisabled) opts.onDisabled();
  });
  hit.on('pointerout', () => {
    down = false;
    press(false);
  });
  if (opts.depth != null) root.setDepth(opts.depth);
  root.setAlpha(enabled ? 1 : 0.45);
  return {
    root,
    text,
    setEnabled(value) {
      enabled = value;
      root.setAlpha(value ? 1 : 0.45);
    },
    setLabel(value) {
      text.setText(value);
    },
  };
}

export function floatText(scene, x, y, message) {
  const text = scene.add.text(x, y, message, font(22, { color: '#3B2416' })).setOrigin(0.5).setDepth(40);
  scene.tweens.add({
    targets: text,
    y: y - 28,
    alpha: 0,
    duration: ms(520),
    onComplete: () => text.destroy(),
  });
  return text;
}

export function panel(graphics, x, y, w, h, fill = 0xfff6e4) {
  graphics.fillStyle(0x3b2416, 0.18);
  graphics.fillRoundedRect(x + 4, y + 6, w, h, 24);
  graphics.fillStyle(fill, 1);
  graphics.fillRoundedRect(x, y, w, h, 24);
  graphics.lineStyle(4, 0x3b2416, 1);
  graphics.strokeRoundedRect(x, y, w, h, 24);
}
