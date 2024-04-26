/**
 * @param {string} command
 * @returns {string[] | undefined}
 */
export function parseCommand(command) {
  const tokens = [];
  while (true) {
    const tokenRes = getNextToken(command);
    if (tokenRes === null) {
      return undefined;
    }
    if (tokenRes === undefined) {
      break;
    }
    const { token, remaining } = tokenRes;
    tokens.push(token);
    command = remaining;
  }
  return tokens;
}

/**
 * @param {string} command
 * @returns {{ token: string, remaining: string } | undefined | null}
 */
function getNextToken(command) {
  command = command.trimStart();
  if (command.length === 0) {
    return undefined;
  }
  let token = "";
  let isInDoubleQuote = false;
  let isInSingleQuote = false;
  for (let i = 0; i < command.length; ++i) {
    const char = command[i];
    switch (char) {
      case "\"": {
        token += "\"";
        if (isInDoubleQuote) {
          isInDoubleQuote = false;
        } else if (!isInSingleQuote) {
          isInDoubleQuote = true;
        }
        break;
      }
      case "\'": {
        token += "\'";
        if (isInSingleQuote) {
          isInSingleQuote = false;
        } else if (!isInDoubleQuote) {
          isInSingleQuote = true;
        }
        break;
      }
      case " ": {
        if (isInDoubleQuote || isInSingleQuote) {
          token += " ";
        } else {
          return { token, remaining: command.slice(i) };
        }
        break;
      }
      case "\\": {
        i += 1;
        if (command[i] === undefined) {
          return null;
        }
        const nextChar = command[i];
        switch (nextChar) {
          case " ":
            token += " ";
            break;
          case "t":
            token += "\t";
            break;
          case "r":
            token += "\r";
            break;
          case "\'":
            token += "\'";
            break;
          case "\"":
            token += "\"";
            break;
        }
        break;
      }
      default:
        token += char;
    }
  }
  if (isInDoubleQuote || isInSingleQuote) {
    return null;
  }
  return { token, remaining: "" };
}