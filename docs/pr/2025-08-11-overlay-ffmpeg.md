# Add FFmpeg overlay support in createInputsOutputs (in‑video image overlays)

## Summary
- Implement overlay rendering via FFmpeg `-filter_complex` in `src/utils/metadata.js#createInputsOutputs()`.
- Add overlay image inputs with proper input options (`-loop 1`, `-framerate <n>`; default 30).
- Build a single filter graph that:
  - Scales the base video (reuse existing profile scale if present; otherwise default `scale=1280:720`).
  - Scales each overlay individually.
  - Composites overlays in sequence with configurable positions.
  - Appends `format=yuv420p` for broad player compatibility.
- Place `-filter_complex` in `outputs[0].options` and map the graph output with `-map [v]`.
- Preserve existing audio mapping/encoders. No behavior change when no overlays are configured.

## Background
The UI exposes overlay configuration (image path, scale, position, framerate), but previously the generated FFmpeg command did not merge overlays into the video pipeline. This PR wires the UI overlay config into the FFmpeg graph so overlays render in the encoded output.

## Changes
- `src/utils/metadata.js`
  - Detect when overlays are present and add each overlay as a separate FFmpeg input with `-loop 1` and `-framerate` (default 30).
  - Construct a filter graph:
    - Overlay scaling: `[{overlayInput}:v]scale=<width>:-1[logoN]` (width defaults to 320 when not specified).
    - Base video scaling:
      - If `profile.video.filter.graph` contains a scale, reuse it.
      - Else default to `scale=1280:720`.
      - Use type-based stream specifier `[<inputIndex>:v]` (not `[<inputIndex>:0]`).
    - Sequential compositing: `${current}[logoN]overlay=x=<x>:y=<y>`; labels chained until final `[v]`.
      - Defaults: `x=(W-w)/2`, `y=(H-h)/2`.
      - If `y` not provided for the first overlay, default to bottom with padding: `y=H-h-24`.
    - Append `format=yuv420p` to the last link in the chain: `...,format=yuv420p[v]`.
  - Attach `-filter_complex` to `outputs[0].options` (not global options) and replace the video `-map` with `-map [v]`.
  - Keep audio options and mappings intact.

## Example (resulting options excerpt)
```sh
-filter_complex "[0:v]scale=1280:720[bg];[1:v]scale=320:-1[logo1];[bg][logo1]overlay=x=(W-w)/2:y=H-h-24[v],format=yuv420p[v]" \
-map [v] ...
```

## Implementation Notes
- The overlay pipeline is only activated when overlays are present. Otherwise the previous per-stream filter behavior is preserved.
- Stream selectors were normalized to type-based (`:v`) to reduce brittleness and to match the working example.
- `-filter_complex` is inserted at the beginning of `outputs[0].options` to ensure correct option ordering.

## Testing
- Add one or more overlays in the Edit view and save.
- Verify the API payload (enable request logging with `REACT_APP_API_DEBUG=true`) includes:
  - Separate overlay inputs with `-loop 1` and `-framerate`.
  - A single `-filter_complex` string with base video scale, per-overlay scale, overlay chaining, and final `format=yuv420p`.
  - `-map [v]` for the video stream in `outputs[0].options`.
- Confirm visual correctness by starting a process and checking the output preview/target player.

## Limitations / Follow‑ups
- Overlays are applied to the first video profile/output. Multi-profile overlay routing is not yet implemented.
- Only image overlays are handled; animated overlays (e.g., GIF/MOV) may require enabling/disabling `-loop 1` based on media type.
- Additional positioning presets and per-overlay alpha controls can be added in the UI in future PRs.

## Risk and Rollback
- Low risk when overlays are disabled (old behavior preserved).
- Rollback by reverting the commits in `src/utils/metadata.js`.

## Checklist
- [x] Overlay inputs added with correct input options.
- [x] Filter graph composes base scale, overlay scales, and positions.
- [x] Final `format=yuv420p` appended and mapped with `-map [v]`.
- [x] Audio mapping unchanged.
- [x] Verified API payload with debug logging.
