import {
  describe, it, expect, afterEach, beforeAll, vi,
} from 'vitest';
import {
  render, cleanup, fireEvent, act,
} from '@testing-library/react';

// @dsplay/react-template-utils reads the dsplay_* globals at import time, so they are set before Post is imported.
beforeAll(() => {
  window.dsplay_media = { duration: 10000, result: { data: { user: {}, posts: [] } } };
  window.dsplay_config = {
    locale: 'en', orientation: 'landscape', width: 1920, height: 1080, osVersion: 30,
  };
  window.dsplay_template = {};
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const poster = 'https://cdn.example/b.jpg';
const sizes = {
  tb: poster, sm: poster, md: poster, lg: poster,
};
const video = { id: 'b', type: 'video', urls: sizes };
const image = { id: 'a', type: 'image', urls: { ...sizes, md: 'https://cdn.example/a.jpg' } };

async function renderPost(media) {
  const { default: Post } = await import('.');
  return render(<Post text="Hello" media={media} user={{}} duration={10000} />);
}

describe('Post media', () => {
  it('plays a video that has a videoUrl: muted, autoplaying, inline, with its poster; the play icon goes once it plays', async () => {
    const play = vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue();
    const { container } = await renderPost([{ ...video, videoUrl: 'https://cdn.example/b.mp4' }]);
    const el = container.querySelector('video');
    expect(el).not.toBeNull();
    expect(el.getAttribute('src')).toBe('https://cdn.example/b.mp4');
    expect(el.getAttribute('poster')).toBe(poster);
    expect(el.muted).toBe(true);
    expect(el.hasAttribute('autoplay')).toBe(true);
    expect(el.hasAttribute('loop')).toBe(true);
    expect(el.hasAttribute('playsinline')).toBe(true);
    expect(el.hasAttribute('muted')).toBe(true);
    expect(play).toHaveBeenCalled();
    expect(container.querySelector('.playWrapper')).not.toBeNull(); // not playing yet: looks as before
    fireEvent.playing(el);
    expect(container.querySelector('.playWrapper')).toBeNull();
  });

  it('falls back to the poster and play icon when the WebView refuses to play it', async () => {
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockRejectedValue(new Error('NotAllowedError'));
    const { container } = await renderPost([{ ...video, videoUrl: 'https://cdn.example/b.mp4' }]);
    await act(async () => {});
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('.media-pic').style.backgroundImage).toBe(`url("${poster}")`);
    expect(container.querySelector('.playWrapper')).not.toBeNull();
  });

  it('keeps today\'s poster and play icon for a video without videoUrl (old answers, licensed audio)', async () => {
    const { container } = await renderPost([video]);
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('.media-pic').style.backgroundImage).toBe(`url("${poster}")`);
    expect(container.querySelector('.playWrapper')).not.toBeNull();
  });

  it('falls back to the poster and play icon when the video cannot play (an expired url)', async () => {
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue();
    const { container } = await renderPost([{ ...video, videoUrl: 'https://cdn.example/expired.mp4' }]);
    fireEvent.error(container.querySelector('video'));
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('.media-pic').style.backgroundImage).toBe(`url("${poster}")`);
    expect(container.querySelector('.playWrapper')).not.toBeNull();
  });

  it('plays a video inside a carousel that starts with an image, and gives a video without videoUrl its play icon', async () => {
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue();
    const playable = await renderPost([image, { ...video, videoUrl: 'https://cdn.example/b.mp4' }]);
    expect(playable.container.querySelector('.media-slider video').getAttribute('src')).toBe('https://cdn.example/b.mp4');
    cleanup();
    const still = await renderPost([image, video]);
    expect(still.container.querySelector('.media-slider video')).toBeNull();
    expect(still.container.querySelectorAll('.media-slider .playWrapper')).toHaveLength(1);
  });

  it('leaves an image as it was', async () => {
    const { container } = await renderPost([image]);
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('.playWrapper')).toBeNull();
    expect(container.querySelector('.media-pic').style.backgroundImage).toBe('url("https://cdn.example/a.jpg")');
  });
});
