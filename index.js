const fs = require('fs');
const path = require('path');
const osc = require('child_process');

const args = process.argv.slice(2);
let home_path = args[0];
if (args.length === 1) {
	console.log('npm run create app_path dependency_1 dependency_2 ...');
	process.exit();
} else {
	if (home_path.includes('../') || home_path.includes('./')) {
		console.log('Relative traversing of directories not accepted.');
		process.exit();
	} else {
		if (fs.existsSync(home_path)) {
			console.log('Directory already exists.');
			console.log('Exiting.');
			process.exit();
		} else {
			let mkdir = (dir_path) => {
				try {
					if (!fs.existsSync(dir_path)) {
						fs.mkdirSync(dir_path);
						console.log(dir_path, 'created.');
					} else {
						console.log('Directory already exists');
						process.exit();
					}
				} catch(error) {
					console.log(error);
					rm_rf(home_path);
					process.exit();
				}
			}
			let rm_rf = (dir_path) => {
				try {
					if (fs.existsSync(dir_path)) {
						fs.rmSync(dir_path, {
							recursive : true,
							force : true
						});
					}
				} catch(error) {
					console.log(error);
					process.exit();
				}
			}
			console.log('Creating app at path', home_path);
			mkdir(home_path);
			mkdir(path.join(home_path, 'views'));
			mkdir(path.join(home_path, 'temp'));
			mkdir(path.join(home_path, 'routes'));
			mkdir(path.join(home_path, 'models'));
			mkdir(path.join(home_path, 'controllers'));
			mkdir(path.join(home_path, 'config'));
			mkdir(path.join(home_path, 'middleware'));
			mkdir(path.join(home_path, 'public'));
			mkdir(path.join(home_path, 'public', 'css'));
			mkdir(path.join(home_path, 'public', 'images'));
			mkdir(path.join(home_path, 'public', 'scripts'));
			mkdir(path.join(home_path, 'scripts'));
			mkdir(path.join(home_path, 'test'));
			mkdir(path.join(home_path, 'bin'));
			let command = 'cd ' + home_path + '; npm init -y; npm install';
			let i = 0;
			for (i = 1; i < args.length; i ++) {
				command += ' ' + args[i];
			}
			command += ';';
			console.log("Executing '", command, "'.");
			osc.exec(command, (error, stdout,stderr) => {
				if (error) {
					console.log(error);
					process.exit();
					rm_rf(home_path);
				} else {
					console.log(stdout);
					console.log('Installed all the required dependencies.');
					let nodemon = '{\n  "ignore": [\n    "test/*",\n    "bin/*",\n    "temp/*"\n  ]\n}';
					fs.writeFile(path.join(home_path, 'nodemon.json'), nodemon, (error) => {
						if (error) {
							console.log(error);
							rm_rf(home_path);
							process.exit();
						} else {
							console.log('Created nodemon.json.');
							let gitignore = 'node_modules/\npackage-lock.json\n.env';
							fs.writeFile(path.join(home_path, '.gitignore'), gitignore, (error) => {
								if (error) {
									console.log(error);
									rm_rf(home_path);
									process.exit();
								} else {
									console.log('Created .gitignore.');
									let env = "NODE_ENV='production'";
									fs.writeFile(path.join(home_path, '.env'), env, (error) => {
										if (error) {
											console.log(error);
											rm_rf(home_path);
											process.exit();
										} else {
											console.log('Created .env.');
											fs.writeFile(path.join(home_path, 'index.js'), "", (error) => {
												if (error) {
													console.log(error);
													rm_rf(home_path);
													process.exit();
												} else {
													console.log('Created index.js.');
													console.log('Finished creating the app.');
													console.log('Exiting.');
													process.exit();
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	}
}
