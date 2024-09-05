const inquirer = require("inquirer");
const fs = require("fs");
const ncp = require("ncp");
const chalk = require("chalk");

inquirer
	.prompt([
		{
			type: "input",
			name: "projectName",
			message: "Enter project name:",
			default: "./",
		},
	])
	.then((answers) => {
		const projectName = answers.projectName;
		const projectDir = projectName === "./" ? "." : projectName;

		if (!fs.existsSync(projectDir)) {
			fs.mkdirSync(projectDir);
		}

		ncp("create-express-app/.", projectDir, (err) => {
			if (err) {
				console.error(err);
			} else {
				console.log(
					chalk.green(`Project created successfully in ${projectDir}`)
				);

				// Read the template package.json and package-lock.json files
				const templatePackageJson = JSON.parse(
					fs.readFileSync(`${projectDir}/package.json`, "utf8")
				);
				const templatePackageLockJson = JSON.parse(
					fs.readFileSync(`${projectDir}/package-lock.json`, "utf8")
				);

				// Replace "create-express-app" with the project name
				templatePackageJson.name = projectName;
				templatePackageLockJson.name = projectName;

				// Write the updated package.json and package-lock.json files to the project directory
				fs.writeFileSync(
					`${projectDir}/package.json`,
					JSON.stringify(templatePackageJson, null, 2)
				);
				fs.writeFileSync(
					`${projectDir}/package-lock.json`,
					JSON.stringify(templatePackageLockJson, null, 2)
				);
			}
		});
	});
