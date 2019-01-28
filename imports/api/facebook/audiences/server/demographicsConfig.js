const config = {
  age: [
    {
      age_min: 18,
      age_max: 24
    },
    {
      age_min: 25,
      age_max: 34
    },
    {
      age_min: 35,
      age_max: 44
    },
    {
      age_min: 45,
      age_max: 54
    },
    {
      age_min: 55,
      age_max: 64
    },
    {
      age_min: 65
    }
  ],
  gender: [
    {
      genders: [1] // Male
    },
    {
      genders: [2] // Female
    }
  ]
  // another: [
  //   {
  //     test: 1
  //   },
  //   {
  //     test: 2
  //   }
  // ]
};

function* cartesian(head, ...tail) {
  let remainder = tail.length ? cartesian(...tail) : [[]];
  for (let r of remainder) {
    yield { ...r };
    for (let h of head) {
      yield { ...h, ...r };
    }
  }
}

export default {
  config,
  specs: [...cartesian(...Object.values(config))]
};
