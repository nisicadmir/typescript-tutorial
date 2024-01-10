export const dummyFunc = async () => {
  const promise = new Promise((res, rej) => {
    setTimeout(() => {
      rej('Sta ovo radis?');
    }, 2_000);
  });

  return promise;
};
