const wrap_gen = g =>
  ({
    next: x => {
      try {
        const value = g.next(x);
        if (value.done) {
          return value;
        }
        return {
          done: false
        , value: value
        };
      }
      catch (e) {
        return { done: true };
      }
    }
  });

const gen_ret = value =>
  ({ done: true, value: value });

const awaiter = g => new Promise(resolve => {
  let fulfilled_value;
  const fulfilled = value => {
    fulfilled_value = value;
    step(g.next());
  };
  const step = result => {
    result.done ?
      resolve(result.value) :
      new Promise(resolve => { resolve(result.value); }).then(fulfilled);
  };
  g = g(() => fulfilled_value);
  step(g.next());
});

const async = g =>
  awaiter(rv => wrap_gen(g(rv)()));
 