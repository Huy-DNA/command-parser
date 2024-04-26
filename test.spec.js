import { expect, it } from "vitest";
import { parseCommand } from ".";

it('Should parse simple command correctly', () => {
  expect(parseCommand("command arg1 arg2 arg3")).toMatchInlineSnapshot(`
    [
      "command",
      "arg1",
      "arg2",
      "arg3",
    ]
  `)
})

it('Should parse command with double quoted args correctly', () => {
  expect(parseCommand(`command "arg1" "arg2" "arg3" "'arg4'"`)).toMatchInlineSnapshot(`
    [
      "command",
      ""arg1"",
      ""arg2"",
      ""arg3"",
      ""'arg4'"",
    ]
  `);
})

it('Should parse command with single quoted args correctly', () => {
  expect(parseCommand(`command 'arg1' 'arg2' '"arg3"'`)).toMatchInlineSnapshot(`
    [
      "command",
      "'arg1'",
      "'arg2'",
      "'"arg3"'",
    ]
  `);
})

it('Should parse command with mixed quoted args correctly', () => {
  expect(parseCommand(`command 'arg1' "arg2" '"arg3"' "'arg4'" arg5`)).toMatchInlineSnapshot(`
    [
      "command",
      "'arg1'",
      ""arg2"",
      "'"arg3"'",
      ""'arg4'"",
      "arg5",
    ]
  `);
})

it('Should parse command with args containing escaped characters correctly', () => {
  expect(parseCommand(`command 'arg1\\'' "arg2\\"" arg3\\ 4`)).toMatchInlineSnapshot(`
    [
      "command",
      "'arg1''",
      ""arg2""",
      "arg3 4",
    ]
  `);
})

it('Should return undefined with invalid commands', () => {
  expect(parseCommand(`command "arg1`)).toMatchInlineSnapshot(`undefined`);
  expect(parseCommand(`command 'arg2`)).toMatchInlineSnapshot(`undefined`);
  expect(parseCommand(`command arg1"`)).toMatchInlineSnapshot(`undefined`);
  expect(parseCommand(`command arg1'`)).toMatchInlineSnapshot(`undefined`);
  expect(parseCommand(`command arg1\\`)).toMatchInlineSnapshot(`undefined`);
})

it('Should parse empty commands successfully', () => {
  expect(parseCommand(``)).toMatchInlineSnapshot(`[]`);
  expect(parseCommand(`    `)).toMatchInlineSnapshot(`[]`);
})