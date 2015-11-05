### Installation

#### Dependencies & pre-reqs
*Recommended versions listed; may work with other versions!*
- Ruby `> 2.0.0`
- Java
- Bundler (`gem install bundler`)
- Probably some patience
- _Recommended_: A UNIX machine

#### Setup
##### Standard Rails stuff
1. Run `bundle install`
2. Set up the DB: `bin/rake db:migrate`

##### Radar stuff
1. Run the initial import: `bundle exec rake data:import`
2. Make sure that this step is successful, with no errors (warnings are OK).
3. _(Optional)_: create a cron job to run the data import every few minutes.

#### Startup
Start the Rails server (`bundle exec rails server`). By default, we use Thin, but
Passenger is also installed by default, so that can be used as well.
