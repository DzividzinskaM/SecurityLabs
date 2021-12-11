const GA = ({
  mutationFn,
  crossoverFn,
  fitnessFn,
  populationArr,
  populationSizeNum,
}) => {
  const algo = {
    mutation: mutationFn,
    crossover: crossoverFn,
    fitness: fitnessFn,
    population: populationArr,
    populationSize: populationSizeNum,
    maxFitness: -Infinity,
    getAll: function () {
      return this.population
        .map((e) => ({ fitness: this.fitness(e), chromosome: e }))
        .sort((a, b) => b.fitness - a.fitness);
    },
    getBest: function () {
      const all = this.getAll();
      const maxFitness = Math.max(...all.map((e) => e.fitness));
      return all
        .filter((e) => e.fitness === maxFitness)
        .filter(
          (e, i, arr) =>
            arr.findIndex((f) => f.chromosome === e.chromosome) === i
        );
    },
    iterate: function () {
      const sortedPopulation = this.population
        .map((e) => ({ f: this.fitness(e), e }))
        .sort((a, b) => b.f - a.f)
        .map((e) => e.e);

      this.maxFitness = this.fitness(sortedPopulation[0]);

      const newPopulation = sortedPopulation
        .flatMap((e, i, arr) =>
          i % 2 === 1 || !arr[i + 1] ? null : this.crossover(e, arr[i + 1])
        )
        .filter((e) => e)
        .map((e) => (Math.random() < 0.5 ? this.mutation(e) : e));
      const halfPopulation = this.populationSize / 2;
      this.population = [
        ...sortedPopulation.slice(0, Math.floor(halfPopulation)),
        ...newPopulation.slice(0, Math.ceil(halfPopulation)),
      ];

      return this;
    },
    populate: function () {
      for (let i = this.population.length; i < this.populationSize; i++) {
        this.population.push(
          this.population[Math.floor(Math.random() * this.population.length)]
        );
      }
    },
  };

  algo.populate();

  return algo;
};

module.exports = GA;
