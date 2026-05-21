"use client";

import { useMemo, useRef } from "react";
import { layoutScore, yToPitch } from "@harmony/renderer";
import type { LayoutNote, LayoutStaff } from "@harmony/renderer";
import type { ChordSymbolEvent, DynamicEvent, LyricEvent, NotationEvent, NoteEvent } from "@harmony/notation-engine";
import { useEditorStore } from "@/lib/editor-store";
import { FloatingToolbar } from "./floating-toolbar";

function eventText(event: NotationEvent): string {
  if (event.kind === "chord-symbol") {
    const quality = event.quality === "minor" ? "m" : event.quality === "major7" ? "maj7" : event.quality === "minor7" ? "m7" : "";
    return `${event.root}${quality}`;
  }
  if (event.kind === "lyric") {
    return event.text;
  }
  if (event.kind === "dynamic") {
    return event.mark;
  }
  if (event.kind === "rest") {
    return "𝄽";
  }
  return "";
}

function accidentalText(note: NoteEvent): string {
  if (note.pitch.alter === 1) {
    return "♯";
  }
  if (note.pitch.alter === -1) {
    return "♭";
  }
  if (note.pitch.alter === 2) {
    return "𝄪";
  }
  if (note.pitch.alter === -2) {
    return "𝄫";
  }
  return "";
}

function noteFill(event: NotationEvent, selected: boolean, playing: boolean): string {
  if (playing) {
    return "#0f766e";
  }
  if (selected) {
    return "#14b8a6";
  }
  return event.kind === "rest" ? "#64748b" : "#111827";
}

function RenderEvent({
  note,
  selected,
  playing,
  onSelect
}: {
  readonly note: LayoutNote;
  readonly selected: boolean;
  readonly playing: boolean;
  readonly onSelect: () => void;
}) {
  const event = note.event;

  if (event.kind === "note") {
    return (
      <g role="button" tabIndex={0} onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onSelect();
      }}>
        <text x={note.x - 24} y={note.y + 4} className="select-none fill-slate-900 text-lg">
          {accidentalText(event)}
        </text>
        <ellipse
          className="note-head"
          cx={note.x}
          cy={note.y}
          data-selected={selected}
          fill={noteFill(event, selected, playing)}
          rx={9}
          ry={6}
          transform={`rotate(-18 ${note.x} ${note.y})`}
        />
        {event.duration.name !== "whole" && (
          <line x1={note.x + 8} x2={note.x + 8} y1={note.y} y2={note.y - 42} stroke="#111827" strokeWidth={2} />
        )}
        {event.articulations.includes("staccato") && <circle cx={note.x} cy={note.y - 24} fill="#111827" r={2} />}
        {event.articulations.includes("accent") && (
          <text x={note.x - 7} y={note.y - 24} className="select-none fill-slate-900 text-sm">
            &gt;
          </text>
        )}
        {event.articulations.includes("tenuto") && <line x1={note.x - 7} x2={note.x + 7} y1={note.y - 22} y2={note.y - 22} stroke="#111827" />}
      </g>
    );
  }

  if (event.kind === "rest") {
    return (
      <text
        role="button"
        tabIndex={0}
        x={note.x - 8}
        y={note.y + 6}
        className="select-none fill-slate-600 text-2xl"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
          onSelect();
        }}
      >
        {eventText(event)}
      </text>
    );
  }

  return (
    <text
      role="button"
      tabIndex={0}
      x={note.x - 16}
      y={note.y}
      className={event.kind === "dynamic" ? "select-none fill-slate-700 text-sm italic" : "select-none fill-slate-700 text-sm"}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onSelect();
      }}
    >
      {eventText(event as ChordSymbolEvent | LyricEvent | DynamicEvent)}
    </text>
  );
}

function StaffLines({ staff }: { readonly staff: LayoutStaff }) {
  return (
    <g>
      {Array.from({ length: 5 }, (_, index) => (
        <line
          key={index}
          className="staff-line"
          x1={staff.x}
          x2={staff.x + staff.width}
          y1={staff.y + index * 10}
          y2={staff.y + index * 10}
        />
      ))}
    </g>
  );
}

export function ScoreView() {
  const score = useEditorStore((state) => state.score);
  const selection = useEditorStore((state) => state.selection);
  const zoom = useEditorStore((state) => state.zoom);
  const playingEventId = useEditorStore((state) => state.playingEventId);
  const select = useEditorStore((state) => state.select);
  const insertAt = useEditorStore((state) => state.insertAt);
  const setZoom = useEditorStore((state) => state.setZoom);
  const touchRef = useRef<{ readonly distance: number; readonly zoom: number } | null>(null);
  const layout = useMemo(() => layoutScore(score), [score]);

  const handlePointer = (clientX: number, clientY: number, svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * layout.width;
    const y = ((clientY - rect.top) / rect.height) * layout.height;
    const hit = layout.systems
      .flatMap((system) => system.staves.flatMap((staff) => staff.notes))
      .find((candidate) => Math.hypot(candidate.x - x, candidate.y - y) < 14);
    if (hit) {
      select({ kind: "event", eventId: hit.event.id });
      return;
    }

    for (const system of layout.systems) {
      for (const staff of system.staves) {
        if (y >= staff.y - 24 && y <= staff.y + 64 && x >= staff.x && x <= staff.x + staff.width) {
          const measureIndex = Math.min(
            system.measures.length - 1,
            Math.max(0, Math.floor((x - staff.x) / 236))
          );
          const measure = system.measures[measureIndex];
          const pitch = yToPitch(y, staff.y, staff.clef);
          select({ kind: "measure", measureId: measure.id, staffId: staff.staffId });
          insertAt(measure.id, staff.staffId, pitch);
          return;
        }
      }
    }
  };

  return (
    <main className="relative min-w-0 flex-1 overflow-hidden bg-slate-100">
      <FloatingToolbar />
      <div
        className="score-scroll h-full overflow-auto p-4"
        onWheel={(event) => {
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setZoom(zoom + (event.deltaY > 0 ? -0.08 : 0.08));
          }
        }}
        onTouchStart={(event) => {
          if (event.touches.length === 2) {
            const [first, second] = [event.touches[0], event.touches[1]];
            touchRef.current = {
              distance: Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY),
              zoom
            };
          }
        }}
        onTouchMove={(event) => {
          if (event.touches.length === 2 && touchRef.current) {
            event.preventDefault();
            const [first, second] = [event.touches[0], event.touches[1]];
            const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
            setZoom(touchRef.current.zoom * (distance / touchRef.current.distance));
          }
        }}
        onDoubleClick={() => setZoom(zoom === 1 ? 1.6 : 1)}
      >
        <div
          className="mx-auto origin-top-left rounded-md bg-white shadow-sm"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `scale(${zoom})`,
            transformOrigin: "top left"
          }}
        >
          <svg
            id="score-svg"
            aria-label="Harmony score"
            className="block"
            height={layout.height}
            role="img"
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            width={layout.width}
            onClick={(event) => handlePointer(event.clientX, event.clientY, event.currentTarget)}
          >
            <rect width={layout.width} height={layout.height} fill="#fff" />
            <text x={54} y={34} className="select-none fill-slate-900 text-2xl font-semibold">
              {score.metadata.title}
            </text>
            {layout.systems.map((system) => (
              <g key={system.index}>
                {system.staves.map((staff) => (
                  <g key={`${system.index}-${staff.staffId}`}>
                    <StaffLines staff={staff} />
                    <text x={staff.x - 38} y={staff.y + 30} className="select-none fill-slate-600 text-xs">
                      {staff.clef}
                    </text>
                    {system.measures.map((measure, index) => {
                      const x = staff.x + index * 236;
                      return (
                        <g key={`${staff.staffId}-${measure.id}`}>
                          <line x1={x} x2={x} y1={staff.y} y2={staff.y + 40} stroke="#64748b" />
                          <text x={x + 6} y={staff.y - 8} className="select-none fill-slate-400 text-xs">
                            {measure.number}
                          </text>
                        </g>
                      );
                    })}
                    <line x1={staff.x + staff.width} x2={staff.x + staff.width} y1={staff.y} y2={staff.y + 40} stroke="#64748b" />
                    {staff.notes.map((note) => (
                      <RenderEvent
                        key={note.event.id}
                        note={note}
                        playing={playingEventId === note.event.id}
                        selected={selection.kind === "event" && selection.eventId === note.event.id}
                        onSelect={() => select({ kind: "event", eventId: note.event.id })}
                      />
                    ))}
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </main>
  );
}
