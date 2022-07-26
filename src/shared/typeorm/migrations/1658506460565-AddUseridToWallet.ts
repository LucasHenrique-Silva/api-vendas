import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddUseridToWallet1658506460565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'wallet',
      new TableColumn({
        name: 'Customer_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'wallet',
      new TableForeignKey({
        name: 'walletCustomer',
        columnNames: ['Customer_id'],
        referencedTableName: 'costumers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('wallet', 'walletCustomer'),
      await queryRunner.dropColumn('wallet', 'Customer_id');
  }
}
