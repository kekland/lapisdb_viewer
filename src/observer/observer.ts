import { Datastore } from 'lapisdb'
import express from 'express'
import pretty from 'express-prettify'

export class LapisObservatory {
  datastores: Datastore<any>[];
  server: express.Application;

  constructor(datastores: Datastore<any>[]) {
    this.datastores = datastores
  }

  async listen(port: number) {
    console.log(`Starting LapisObservatory on port ${port}`)
    this.server = express()
    this.server.use(pretty())

    for (const datastore of this.datastores) {
      const name = datastore.name
      console.log(`[Datastore ${name}] listening on route /${name} and /${name}/:id`)

      this.server.get(`/${name}`, async (req, res) => {
        const data = await datastore.get().run()
        res.json(data)
      })
      
      this.server.get(`/${name}/:id`, async (req, res) => {
        const data = await datastore.get().where(v => v.meta.id === req.params.id).run()
        res.json(data)
      })
    }
    
    console.log(`LapisObservatory started on port ${port}`)
  }
}