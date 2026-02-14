export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const classNames = (...classes: any[]) =>
  classes.filter(Boolean).join(" ");
