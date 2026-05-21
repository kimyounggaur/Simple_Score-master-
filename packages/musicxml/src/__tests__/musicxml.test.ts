import { describe, expect, it } from "vitest";
import { exportMusicXml, importMusicXml } from "../index";

describe("MusicXML import/export", () => {
  it("imports a minimal partwise score and exports it back", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <work><work-title>Round Trip</work-title></work>
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time></attributes>
      <harmony><root><root-step>C</root-step></root><kind>major</kind></harmony>
      <note><pitch><step>C</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type><lyric><text>라</text></lyric></note>
    </measure>
  </part>
</score-partwise>`;
    const result = importMusicXml(xml);
    expect(result.score.metadata.title).toBe("Round Trip");
    expect(exportMusicXml(result.score)).toContain("<score-partwise");
  });
});
