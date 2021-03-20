require('dotenv').config()
require('./logger')

const fs = require('fs/promises')
const path = require('path')
const bcrypt = require('bcryptjs')
const knex = require('./db')

logger.info('Generate SQL')

;(async() => {
    /* Clear database */
    const { rows: tables } = await knex.raw(`select 'drop table "' || tablename || '" cascade;' as name from pg_tables where schemaname = 'public'`);

    if (tables.length) {
        const clearSQL = tables.reduce((sql, command) => sql + command.name, '');
        await knex.raw(clearSQL);
        logger.info('Database remove')
    }

    /* Create tables */
    let tables_path = path.join(__dirname, 'sql');
    let tables_url = await fs.readdir(tables_path);

    tables_url = tables_url.filter(file => '.sql' === path.extname(file))
    tables_url.sort((a, b) => a.split('.')[0] - b.split('.')[0]);

    for (table_name of tables_url) {
        let sql = await fs.readFile(path.join(tables_path, table_name))
        sql = sql.toString().split('--')[0].trim();

        await knex.raw(sql)
        logger.trace(`Created: ${table_name}`);
    }

    /* Get filename by uploads */
    const photo_path = path.join(__dirname, 'uploads', 'small_photo');
    const photo_small = await fs.readdir(photo_path);

    function randPhoto () {
        return photo_small[Math.floor(Math.random() * (photo_small.length + 1))]
    }

    /* Database Queries */
    async function createUser ({username, role, name, surname, patronymic, description}) {
        username = username.substr(0, 16)

        const [ id ] = await knex('users').insert({
            username: username,
            password: bcrypt.hashSync(username, 10),
            role: role,
            name,
            surname,
            patronymic,
            small_photo: randPhoto(),
            description
        }).returning('id')

        return id;
    }

    const users = require('./sql/users.json')

    logger.info(`Available users: ${users.length}`)

    /* Insert users and teams */
    const teamsCount = 30
    let counter = 0;

    for (let i = 0; i < teamsCount; i++) {
        const teams_members = [];

        // Create team
        const [ team_id ] = await knex('teams')
            .insert({
                team_name: 'Team ' + users[counter].team_name,
                team_description: users[counter].team_description,
                archive: false,
                customer: users[users.length - counter - 1].surname
            })
            .returning('id')

        for (let a = 0; a < 4; a++) {
            // Create students
            const user_id = await createUser({
                ...users[counter],
                role: 'student',
                description: 'РНТЦ, Мехатроника'
            })


            teams_members.push({
                team_id,
                user_id,
                team_role: a === 0 ? 'leader' : 'member'
            })

            counter++
        }

        const user_id = await createUser({
            ...users[counter],
            role: 'curator'
        })

        // createUser2(users[counter])

        teams_members.push({
            team_id,
            user_id,
            team_role: 'curator'
        })

        counter++

        // Add users in team
        await knex('teams_members')
            .insert(teams_members)

        logger.trace(`Team #${team_id} created`)
    }

    /* Events */
    const events = [
        {event_name: 'Крашетест', event_description: 'IT Команды', event_start: new Date('December 20, 2021 16:30:00'), event_end: new Date('December 20, 2021 18:30:00'), completed: true},
        {event_name: 'Крашетест', event_description: 'Гуманитарные команды', event_start: new Date('December 21, 2021 16:00:00'), event_end: new Date('December 21, 2021 17:00:00'), completed: true},
        {event_name: 'Стрестест', event_description: 'IT Команды', event_start: new Date()},
        {event_name: 'Стрестест', event_description: 'Гуманитарные команды', event_start: new Date()},
        {event_name: 'Финал', event_description: 'Конец мероприятия', event_start: new Date('2 July, 2021 16:30:00')}
    ]

    for(let event of events) {
        const { event_name } = event;
        const events_guests = [];

        const [ event_id ] = await knex('events')
            .insert(event)
            .returning('id')

        for (let i = 0; i < 4; i++) {
            const user_id = await createUser({
                ...users[counter],
                role: 'guest',
            })

            events_guests.push({
                event_id,
                user_id
            })

            counter++
        }

        await knex('events_guests')
            .insert(events_guests)

        const events_teams = [];

        for (let e = 0; e < getRandomInt(3, 6); e++) {
            events_teams.push({
                event_id,
                team_id: getRandomInt(1, teamsCount)
            })
        }

        await knex('events_teams')
            .insert(events_teams)

        logger.trace(`Event ${event_name} created`)
    }

    await createUser({
        username: 'bromanla',
        role: 'moderator',
        name: 'Роман',
        surname: 'Жуков',
        patronymic: 'Сергеевич'
    })

    logger.info('Ok!!!')
})()

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
