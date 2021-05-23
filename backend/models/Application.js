const Database = require('../database/config')

module.exports = {
  async addApplication(app, dev) {
    const db = await Database(dev);
    const stmt = await db.prepare(`
      INSERT INTO application
      (
        name,
        context,
        monitoring_url,
        is_active
      ) VALUES
      (?,?,?,1)
    `);
    await stmt.run(app.name, app.context, app.monitoringUrl);
    await stmt.finalize();
    await db.close();
  },

  async findAllActiveApplication(dev) {
    const db = await Database(dev);
    const stmt = await db.prepare(`
      SELECT * FROM application WHERE is_active = 1
    `);
    const apps = await stmt.all();
    await stmt.finalize();
    await db.close();

    return apps.map(app => {
      return {
        id: app.id,
        name: app.name,
        context: app.context,
        monitoringUrl: app.monitoring_url,
        isActive: true
      }
    })
  },

  async disableApplication(id, dev) {
    const db = await Database(dev);
    let stmt = await db.prepare(`
      SELECT * FROM application WHERE is_active = 1 AND id = ?
    `);
    const app = await stmt.get(id);
    await stmt.finalize();
    if(app) {
      stmt = await db.prepare(`
        UPDATE application SET is_active = 0 WHERE id = ?
      `)
      await stmt.run(id);
      await stmt.finalize();
    } else {
      throw new Error('Application not found.');
    }
    await db.close();

  },

  async enableApplication(id, dev) {
    const db = await Database(dev);
    let stmt = await db.prepare(`
      SELECT * FROM application WHERE is_active = 0 AND id = ?
    `);
    const appToUpdate = await stmt.get(id);
    await stmt.finalize();
    if(appToUpdate) {
      stmt = await db.prepare(`
        UPDATE application SET is_active = 1 WHERE id = ?
      `)
      await stmt.run(id);
      await stmt.finalize();
    } else {
      throw new Error('Application not found.');
    }
    await db.close();
  },

  async updateApplication(app, dev) {
    const db = await Database(dev);
    let stmt = await db.prepare(`
      SELECT * FROM application WHERE is_active = 1 AND id = ?
    `);
    const appToUpdate = await stmt.get(app.id);
    await stmt.finalize();
    if(appToUpdate) {
      stmt = await db.prepare(`
        UPDATE application SET name = ?, context = ?, monitoring_url = ?  WHERE id = ?
      `)
      await stmt.run(app.name, app.context, app.monitoringUrl, app.id);
      await stmt.finalize();
    } else {
      throw new Error('Application not found.');
    }
    await db.close();

  },

  async findAllInactiveApplication(dev) {
    const db = await Database(dev);
    const stmt = await db.prepare(`
      SELECT * FROM application WHERE is_active = 0
    `);
    const apps = await stmt.all();
    await stmt.finalize();
    await db.close();

    return apps.map(app => {
      return {
        id: app.id,
        name: app.name,
        context: app.context,
        monitoringUrl: app.monitoring_url,
        isActive: false
      }
    })
  }
}
