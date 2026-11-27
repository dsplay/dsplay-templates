import { describe, it, expect, vi, afterEach } from 'vitest';
import buildWifiString, { escapeWifiValue } from './build-wifi-string';

afterEach(() => vi.restoreAllMocks());

describe('buildWifiString', () => {
  it('builds a WPA network', () => {
    expect(buildWifiString({ ssid: 'Cafe', authType: 'wpa', password: 'secret' }))
      .toBe('WIFI:S:Cafe;T:WPA;P:secret;;');
  });

  it('builds a WEP network', () => {
    expect(buildWifiString({ ssid: 'Old', authType: 'wep', password: '12345' }))
      .toBe('WIFI:S:Old;T:WEP;P:12345;;');
  });

  it('maps WPA3 (sae) to WPA', () => {
    expect(buildWifiString({ ssid: 'New', authType: 'sae', password: 'pw' }))
      .toBe('WIFI:S:New;T:WPA;P:pw;;');
  });

  it('omits the password on open networks, even if one was given', () => {
    expect(buildWifiString({ ssid: 'Open', authType: 'none', password: 'ignored' }))
      .toBe('WIFI:S:Open;T:nopass;;');
    expect(buildWifiString({ ssid: 'Open' })).toBe('WIFI:S:Open;T:nopass;;');
  });

  it('flags hidden networks', () => {
    expect(buildWifiString({
      ssid: 'Ghost', authType: 'wpa', password: 'pw', hidden: true,
    })).toBe('WIFI:S:Ghost;T:WPA;P:pw;H:true;;');
  });

  it('escapes ; , : \\ and " in ssid and password', () => {
    expect(buildWifiString({ ssid: 'a;b"c', authType: 'wpa', password: 'p:w,\\x' }))
      .toBe('WIFI:S:a\\;b\\"c;T:WPA;P:p\\:w\\,\\\\x;;');
  });

  it('keeps unicode untouched', () => {
    expect(escapeWifiValue('Café 日本')).toBe('Café 日本');
  });

  it('logs an unknown auth_type instead of silently opening the network', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(buildWifiString({ ssid: 'X', authType: 'wpa9', password: 'pw' }))
      .toBe('WIFI:S:X;T:WPA;P:pw;;');
    expect(warn).toHaveBeenCalledOnce();
  });
});
