import React from 'react';
import { render, fireEvent } from '../../../utils/testing';
import '@testing-library/jest-dom';

import * as Network from './Network';

test('FFmpeg 5: RTSP with -timeout', async () => {
	let $settings = {};
	const handleChange = (settings) => {
		$settings = settings;
	};

	let $inputs = [];
	const handleProbe = (_, inputs) => {
		$inputs = inputs;
	};

	const Source = Network.component;
	let { getByLabelText, getByText, queryByText, getByRole, rerender } = render(<Source onChange={handleChange} onProbe={handleProbe} />);

	const input = getByLabelText('Address');
	fireEvent.change(input, { target: { value: 'rtsp://127.0.0.1/live/stream' } });

	expect($settings.mode).toBe('pull');
	expect($settings.address).toBe('rtsp://127.0.0.1/live/stream');

	rerender(<Source settings={$settings} onChange={handleChange} onProbe={handleProbe} />);

	expect(queryByText('This protocol is unknown or not supported by the available FFmpeg binary.')).toBeInTheDocument();

	const $skills = {
		ffmpeg: {
			version: '5.1.2',
		},
		formats: {
			demuxers: ['rtsp'],
		},
	};

	rerender(<Source settings={$settings} skills={$skills} onChange={handleChange} onProbe={handleProbe} />);

	expect(queryByText('This protocol is unknown or not supported by the available FFmpeg binary.')).toBe(null);
	expect(getByText('Probe')).toBeInTheDocument();

	const button = getByRole('button', { name: 'Probe' });
	fireEvent.click(button, { bubbles: true });

	expect($inputs.length).toBe(1);
	expect($inputs[0]).toStrictEqual({
		address: 'rtsp://127.0.0.1/live/stream',
		options: ['-fflags', '+genpts', '-thread_queue_size', 512, '-timeout', 5000000, '-rtsp_transport', 'tcp'],
	});
});
