if (typeof Meteor == "undefined") {
  const fs = require("fs");
  const nodeGlob = require("glob");
  const mkdirp = require("mkdirp");
  const { get } = require("lodash");
  const { transform, transformSync, parseSync } = require("@babel/core");

  const FILES_TO_PARSE = "imports/**/!(*.test).{js,jsx}";

  const glob = pattern =>
    new Promise((resolve, reject) => {
      nodeGlob(pattern, (error, value) =>
        error ? reject(error) : resolve(value)
      );
    });

  const readFile = fileName =>
    new Promise((resolve, reject) => {
      fs.readFile(fileName, "utf8", (error, value) =>
        error ? reject(error) : resolve(value)
      );
    });

  const newLine = () => process.stdout.write("\n");

  let messageMap = {};

  const extractFromFile = async filename => {
    try {
      if (filename.indexOf("/server/") == -1) {
        const code = await readFile(filename);
        const output = await transform(code, {
          filename,
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties", "react-intl"]
        });
        const messages = get(output, "metadata.react-intl.messages", []);

        for (const message of messages) {
          messageMap[message.id] = message;
        }
      }
    } catch (error) {
      process.stderr.write(
        `\nError transforming file: ${filename}\n${error}\n`
      );
    }
  };

  const memoryTask = glob(FILES_TO_PARSE);

  memoryTask.then(files => {
    const extractTask = Promise.all(
      files.map(fileName => extractFromFile(fileName))
    );
    extractTask.then(() => {
      mkdirp("./locales/messages");
      fs.writeFileSync(
        "./locales/messages/messages.json",
        JSON.stringify(Object.values(messageMap))
      );

      const {
        default: manageTranslations
      } = require("react-intl-translations-manager");

      manageTranslations({
        messagesDirectory: "./locales/messages",
        translationsDirectory: "./locales/",
        languages: ["en", "es", "pt-BR"],
        singleMessagesFile: true
      });
    });
  });
}
