import type { PlaybackEvent } from "./scheduler";

function textBytes(text: string): number[] {
  return Array.from(text).map((char) => char.charCodeAt(0));
}

function uint32(value: number): number[] {
  return [(value >> 24) & 255, (value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function uint16(value: number): number[] {
  return [(value >> 8) & 255, value & 255];
}

function variableLength(value: number): number[] {
  let buffer = value & 0x7f;
  const bytes: number[] = [];
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= (value & 0x7f) | 0x80;
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) {
      buffer >>= 8;
    } else {
      break;
    }
  }
  return bytes;
}

export function eventsToMidiFile(events: PlaybackEvent[], bpm: number): Uint8Array {
  const ticksPerBeat = 480;
  const microsecondsPerQuarter = Math.round(60_000_000 / bpm);
  const track: number[] = [
    0,
    0xff,
    0x51,
    0x03,
    (microsecondsPerQuarter >> 16) & 255,
    (microsecondsPerQuarter >> 8) & 255,
    microsecondsPerQuarter & 255
  ];

  const noteMessages = events.flatMap((event) => [
    {
      tick: Math.round(event.startBeat * ticksPerBeat),
      bytes: [0x90, event.midi, Math.round(event.velocity * 100)]
    },
    {
      tick: Math.round((event.startBeat + event.durationBeats) * ticksPerBeat),
      bytes: [0x80, event.midi, 0]
    }
  ]);

  noteMessages.sort((a, b) => a.tick - b.tick);
  let previousTick = 0;
  for (const message of noteMessages) {
    track.push(...variableLength(message.tick - previousTick), ...message.bytes);
    previousTick = message.tick;
  }
  track.push(0, 0xff, 0x2f, 0);

  const header = [...textBytes("MThd"), ...uint32(6), ...uint16(0), ...uint16(1), ...uint16(ticksPerBeat)];
  const body = [...textBytes("MTrk"), ...uint32(track.length), ...track];
  return Uint8Array.from([...header, ...body]);
}
