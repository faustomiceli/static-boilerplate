import argv from 'yargs';

const CONFIG = {
	isProduction: false,
	uglify: {
		cache: true,
		parallel: true,
		sourceMap: true,
	},
	cssNano: {
		reduceTransforms: false,
		discardUnused: false,
		zindex: false,
		discardComments: {
			removeAll: true,
		}
	},
	autoprefixer: {
		grid: true,
		browsers: ['last 4 version', 'iOS >= 8'],
	}
};

if (argv.argv.env === 'prod') {
	CONFIG.isProduction = true;
}

export default CONFIG;
