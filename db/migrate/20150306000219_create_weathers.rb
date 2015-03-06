class CreateWeathers < ActiveRecord::Migration
  def change
    create_table :weathers do |t|
      t.string :code
      t.string :name
      t.string :current
      t.string :forecast

      t.timestamps null: false
    end
  end
end
