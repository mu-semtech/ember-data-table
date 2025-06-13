import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') firstname;
  @attr('string') lastname;
  @attr('number') age;
  @attr() created;
  @attr() modified;
}
