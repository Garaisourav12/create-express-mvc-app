#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const ncp = require("ncp").ncp;

(async () => {
	const chalk = (await import("chalk")).default; // Dynamically import chalk

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

			// Create the project directory if it doesn't exist
			if (!fs.existsSync(projectDir)) {
				fs.mkdirSync(projectDir);
			}

			// Copy the template files to the new project directory
			ncp("create-express-app/.", projectDir, (err) => {
				if (err) {
					console.error(
						chalk.red(`Error while copying files: ${err.message}`)
					);
					process.exit(1);
				} else {
					console.log(
						chalk.green(
							`Project created successfully in ${projectDir}`
						)
					);

					try {
						// Read and modify the template package.json
						const packageJsonPath = `${projectDir}/package.json`;
						const packageLockJsonPath = `${projectDir}/package-lock.json`;

						// Check if the files exist before reading
						if (fs.existsSync(packageJsonPath)) {
							const templatePackageJson = JSON.parse(
								fs.readFileSync(packageJsonPath, "utf8")
							);
							templatePackageJson.name = projectName;

							fs.writeFileSync(
								packageJsonPath,
								JSON.stringify(templatePackageJson, null, 2)
							);
						}

						if (fs.existsSync(packageLockJsonPath)) {
							const templatePackageLockJson = JSON.parse(
								fs.readFileSync(packageLockJsonPath, "utf8")
							);
							templatePackageLockJson.name = projectName;

							fs.writeFileSync(
								packageLockJsonPath,
								JSON.stringify(templatePackageLockJson, null, 2)
							);
						}

						console.log(
							chalk.green("Package files updated successfully.")
						);
					} catch (err) {
						console.error(
							chalk.red(
								`Error while updating package files: ${err.message}`
							)
						);
					}
				}
			});
		})
		.catch((err) => {
			console.error(chalk.red(`Error during prompt: ${err.message}`));
		});
})();
