import { Migration } from '@mikro-orm/migrations';

export class Migration20241124205716 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create extension if not exists "uuid-ossp";');
    this.addSql('create type "user_role_type" as enum (\'USER\', \'ADMIN\');');
  }

  override async down(): Promise<void> {
    this.addSql('drop extension if exists "uuid-ossp";')
    this.addSql('drop type "user_role_type";');
  }

}
