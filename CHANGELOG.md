# Restreamer-UI

## v1.6.0 > v1.7.0

-   Add analyzeduration, probesize and max_probe_packets input options
-   Add avoid_negative_ts input option
-   Add http_proxy input option ([#513](https://github.com/datarhei/restreamer/issues/513))
-   Add copyts, start_at_zero and use_wallclock_as_timestamps input options
-   Add heuristic to find core address if UI is proxied
-   Add Turkish translation (thanks to Ramazan Sancar) ([#22](https://github.com/datarhei/restreamer-ui/issues/22))
-   Add Danish translation (Thanks to Filip Stadler and Info)
-   Add Slovenian translation (thanks to Grega)
-   Add Greek translation
-   Mod allows general input settings for pull and push streams
-   Mod updates npm dependencies
-   Fix Creative Commons icons
-   Fix positioning of the deinterlacing filter ([#465](https://github.com/datarhei/restreamer/issues/465))

## v1.5.1 > v1.6.0

-   Add Bob Weaver Deinterlacing Filter ([#465](https://github.com/datarhei/restreamer/issues/465))
-   Add tests for wizard, network source, and coders
-   Add Korean translation (thanks to Jihaeng)
-   Mod splitting wizard in components
-   Fix wrong call to encoder defaults ([#467](https://github.com/datarhei/restreamer/issues/467))

## v1.5.0 > v1.5.1

-   Fix FFmpeg version check for RTSP sources ([#455](https://github.com/datarhei/restreamer/issues/455))
-   Fix requires Core >= v16.11.0 and FFmpeg >= 5.1.0

## v1.4.0 > v1.5.0

-   Add changelog viewer
-   Add skills props to encoder and decoder components
-   Add fps_mode to x264, x265, vp9 encoder
-   Add scale filter to non-hwaccel encoders
-   Add PeerTube and Media Network to publication services (plattforms, software)
-   Add reset button to hide a player logo ([#431](https://github.com/datarhei/restreamer/issues/431))
-   Mod expands V4L2_M2M options (an unstable RPI 64bit encoder)
-   Mod indicates a faulty cache configuration
-   Mod switches to the improved SRT syntax (thx to SA Consulting)
-   Mod improves display of progress data
-   Mod removes deprecated param ocl - now ochl (ff5)
-   Mod simplifies the setup of Restreamer-to-Restreamer connections
-   Mod adds Istafeed.me as StreamKey service to Instagram's publishing service
-   Mod renames "Low delay" to "Low latency (buffer)" and set false as default (requires more feedback)
-   Del removes support for clappr player
-   Fix npm dependencies (security fixes)
-   Fix videojs-overlay logo size ([#431](https://github.com/datarhei/restreamer/issues/431))
-   Fix use of TLS for input from local RTMP server
-   Fix Icecast publication service settings (datarhei/restreamer#429)
-   Fix removes SRT bitstream on tee (OBS > RTMP > SRT is faulty)

Dependency:

-   datarhei Core v16.11.0+

## v1.3.0 > v1.4.0

-   Add email field for Let's Encrypt certification

Dependency:

-   datarhei Core v16.10.1+

## v1.2.0 > v1.3.0

-   Add dlive & Trovo publication services
-   Add low_delay option to processing (default: true)
-   Mod uses the ingest stream for publication (datarhei/restreamer#411)
-   Mod optimized DVR on DiskFS
-   Mod updates packages
-   Fix SRT bitstream on tee
-   Fix typo
-   Fix viewer count (datarhei/restreamer#394)
-   Fix user registration if username and/or password are set via environment (datarhei/restreamer-ui#13)
-   Fix Dockerfile, Reduce size, serve production build (datarhei/restreamer-ui#12)

Dependency:

-   datarhei Core v16.10.0+

## v1.1.0 > v1.2.0

-   Add allow writing HLS to disk
-   Add audio pan filter
-   Add video rotation filter ([#347](https://github.com/datarhei/restreamer/discussions/347))
-   Add video h/v flip filter
-   Add audio volume filter ([#313](https://github.com/datarhei/restreamer/issues/313))
-   Add audio loudness normalization filter
-   Add audio resample filter, that was before part of the encoders
-   Add HLS Master playlist (requires FFmpeg hlsbitrate.patch) (thx Dwaynarang, Electra Player compatibility)
-   Add LinkedIn & Azure Media Services to publication services (thx kalashnikov)
-   Add AirPlay support with silvermine videojs plugin
-   Add Chromecast support (thx badincite, [#10](https://github.com/datarhei/restreamer-ui/pull/10))
-   Add stream distribution across multiple internal servers
-   Add SRT settings
-   Add HLS version selection (thx Dwaynarang, Electra Player compatibility)
-   Add Owncast to publication services ([#369](https://github.com/datarhei/restreamer/issues/369))
-   Add Telegram to publication services (thx Martin Held)
-   Add Polish translations (thx Robert Rykała)
-   Mod extends the datarhei Core publication service with srt streaming
-   Mod allow decoders and encoders to set global options
-   Mod allow trailing slash on Core address
-   Fix player problem with different stream formats (9:16)
-   Fix process report naming
-   Fix publication service icon styles
-   Fix VAAPI encoder

Dependency:

-   datarhei Core v16.9.0+

## v1.0.0 > v1.1.0

-   Add compatibility list for encoders
-   Add "HLS cleanup" as an optional function ([Philipp Trenz](https://github.com/philipptrenz))
-   Add /ui info to / ([#326](https://github.com/datarhei/restreamer/issues/326))
-   Add Russian translation (thx Inthegamelp)
-   Add missed VAAPI encoder
-   Add missed V4L2_M2M encoder
-   Add missed Raspberry Pi 64bit Docker image
-   Add option to disable playersites share-button (thx Anders Mellgren)
-   Add security pr
-   Mod updates VideoJS
-   Fix hides unset content license on playersite (thx Anders Mellgren)
-   Fix updates V4L2 device-list on select
-   Fix snapshot interval ([#341](https://github.com/datarhei/restreamer/issues/340))
-   Fix reverse proxy issue ([#340](https://github.com/datarhei/restreamer/issues/340))
-   Fix double escape failer ([#336](https://github.com/datarhei/restreamer/issues/336))
-   Fix type in player plugin ([#336](https://github.com/datarhei/restreamer/issues/336))
-   Fix deletes processes with dependencies (thx Patron Ramakrishna Chillara)
-   Fix datarhei Core publication service
-   Fix dependabot alerts
-   Fix code scanning alerts

Preparation for FFmpeg v5.0 (migration will not work)

-   Add FFmpeg v5.0 commands (preparation)
-   Mod allows FFmpeg v5.0 (preparation)
