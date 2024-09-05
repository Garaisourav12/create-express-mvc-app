#!/usr/bin/env node

const fs = require("fs").promises;
const { existsSync } = require("fs");
const path = require("path");

(async () => {
	const chalk = (await import("chalk")).default; // Correctly import chalk
	const inquirer = (await import("inquirer")).default; // Correctly import inquirer

	inquirer
		.prompt([
			{
				type: "input",
				name: "projectName",
				message: "Enter project name:",
				default: "", // Default to current directory
			},
		])
		.then(async (answers) => {
			let projectName = answers.projectName;
			let projectDir = projectName;

			// If project name is empty
			if (!projectName) {
				throw new Error("Project name is required!");
			}
			// If project name is ".", use current directory name
			if (projectName === ".") {
				projectName = path.basename(process.cwd()); // Use current directory name
				projectDir = "."; // Set to current directory
			}

			// If project name is not provided, throw an error
			if (!projectName) {
				throw new Error("Project name is required!");
			}

			// Create the project directory if it doesn't exist
			if (projectDir !== "." && !existsSync(projectDir)) {
				await fs.mkdir(projectDir);
			}

			const sourceDir = path.join(__dirname, "create-express-app");

			try {
				await copyDirectory(sourceDir, projectDir);
				console.log(
					chalk.green(
						`Project created successfully in ${projectDir}!`
					)
				);

				// Instructions
				console.log(chalk.green(`To setup the project, run:`));
				if (projectDir === ".") {
					console.log(chalk.green(`cd ${projectName}`));
				}
				console.log(chalk.green(`npm install`));
				console.log(
					chalk.green(
						`CREATE .env file according to config/envConfig.js`
					)
				);
				console.log(chalk.green(`\nRun your application with:`));
				console.log(chalk.green(`npm start - for production`));
				console.log(chalk.green(`npm run dev - for development`));

				// Modify package.json and package-lock.json
				await updatePackageFiles(projectDir, projectName);
			} catch (err) {
				console.error(
					chalk.red(`Error while copying files: ${err.message}`)
				);
				process.exit(1);
			}
		})
		.catch((err) => {
			console.error(chalk.red(`Error during prompt: ${err.message}`));
		});
})();

// Function to copy directory recursively
async function copyDirectory(source, destination) {
	const entries = await fs.readdir(source, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(source, entry.name);
		const destPath = path.join(destination, entry.name);

		if (entry.isDirectory()) {
			await fs.mkdir(destPath, { recursive: true });
			await copyDirectory(srcPath, destPath);
		} else {
			await fs.copyFile(srcPath, destPath);
		}
	}
}

// Function to update package files
async function updatePackageFiles(projectDir, projectName) {
	try {
		const packageJsonPath = path.join(projectDir, "package.json");
		const packageLockJsonPath = path.join(projectDir, "package-lock.json");

		// Check if the files exist before reading
		if (existsSync(packageJsonPath)) {
			const templatePackageJson = JSON.parse(
				await fs.readFile(packageJsonPath, "utf8")
			);
			templatePackageJson.name = projectName;

			await fs.writeFile(
				packageJsonPath,
				JSON.stringify(templatePackageJson, null, 2)
			);
		}

		if (existsSync(packageLockJsonPath)) {
			const templatePackageLockJson = JSON.parse(
				await fs.readFile(packageLockJsonPath, "utf8")
			);
			templatePackageLockJson.name = projectName;
			console.log(templatePackageLockJson.packages);
			templatePackageLockJson.packages[""].name = projectName;

			await fs.writeFile(
				packageLockJsonPath,
				JSON.stringify(templatePackageLockJson, null, 2)
			);
		}

		console.log(chalk.green("Package files updated successfully."));
	} catch (err) {
		console.error(
			chalk.red(`Error while updating package files: ${err.message}`)
		);
	}
}
