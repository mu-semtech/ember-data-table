import Service from "@ember/service";

export default class CreateDataService extends Service {
  generatedData = null;
  generatedAmount = null;

  generatePeople(amount) {
    if(this.generatedAmount === amount && this.generatedData) {
      return this.generatedData;
    }

    const firstNames = [
      'John',
      'Jane',
      'Alice',
      'Bob',
      'Charlie',
      'David',
      'Eve',
      'Frank',
      'Grace',
    ];
    const lastNames = [
      'Doe',
      'Smith',
      'Johnson',
      'Brown',
      'Williams',
      'Jones',
      'Miller',
      'Davis',
      'Garcia',
      'Martinez',
    ];
    const list = [];

    for (let i = 0; i < amount; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const age = 20 + (i % 30);
      const created = new Date(Date.now() - 1000000000 * i);
      const modified = new Date(Date.now() - 1000000000 * i);

      list.push({
        id: i,
        firstname: firstName,
        lastname: lastName,
        age: age,
        created: created,
        modified: modified,
      });
    }

    this.generatedAmount = amount;
    this.generatedData = list;

    return this.generatedData;
  }

  generatePaginationMeta(page, size, count) {
    const pages = Math.floor(count / size);

    return {
      count: count,
      pagination: {
        first: { number: 0, size: size },
        prev: { number: Math.max(0, page - 1), size: size },
        next: { number: Math.min(page + 1, pages), size: size },
        last: { number: pages },
      },
    };
  }

  compareAny(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  }

  async queryPeople(query) {
    let people = this.generatePeople(100);

    if (query.sort) {
      const [sortOrder, sortType] = query.sort.startsWith('-')
        ? [-1, query.sort.slice(1)]
        : [1, query.sort];

      people.sort(
        (a, b) => sortOrder * this.compareAny(a[sortType], b[sortType])
      );
    }

    if (query.filter) {
      people = people.filter((p) =>
        `${p.firstname} ${p.lastname}`
          .toLowerCase()
          .includes(query.filter.toLowerCase().trim())
      );
    }

    const count = people.length;

    if (query.page) {
      const start = query.page.number * query.page.size;

      people = people.slice(start, start + query.page.size);
      people.meta = this.generatePaginationMeta(
        query.page.number,
        query.page.size,
        count
      );
    }

    return Promise.resolve(people);
  }
}
