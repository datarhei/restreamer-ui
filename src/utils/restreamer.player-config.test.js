import Restreamer from './restreamer';

test('UpdatePlayerConfig publishes JavaScript and JSON variants', async () => {
	const restreamer = Object.create(Restreamer.prototype);

	restreamer.InitPlayerSettings = jest.fn((player) => player);
	restreamer.GetChannelManifestPath = jest.fn(() => '/memfs/test.m3u8');
	restreamer.GetChannelPosterPath = jest.fn(() => '/memfs/test.jpg');
	restreamer._uploadAssetData = jest.fn().mockResolvedValue(true);

	const metadata = {
		player: {
			logo: { image: '' },
			poster: '',
		},
		control: {
			preview: { enable: false },
			hls: { storage: 'memfs' },
		},
		license: 'none',
		meta: {
			name: 'Test channel',
			author: { name: 'Tester' },
		},
	};

	await restreamer.UpdatePlayerConfig('channel-1', metadata);

	expect(restreamer._uploadAssetData).toHaveBeenCalledTimes(2);

	const jsCall = restreamer._uploadAssetData.mock.calls[0];
	const jsonCall = restreamer._uploadAssetData.mock.calls[1];

	expect(jsCall[0]).toBe('/channels/channel-1/config.js');
	expect(jsonCall[0]).toBe('/channels/channel-1/config.json');

	expect(jsCall[1]).toBe('var playerConfig = ' + jsonCall[1]);
	expect(JSON.parse(jsonCall[1])).toEqual(
		expect.objectContaining({
			source: '/memfs/test.m3u8',
			poster: '/memfs/test.jpg',
			license: {
				license: 'none',
				title: 'Test channel',
				author: 'Tester',
			},
		}),
	);
});
