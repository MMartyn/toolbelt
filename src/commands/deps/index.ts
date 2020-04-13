import { flags as oclifFlags } from '@oclif/command'

import { CustomCommand } from '../../oclif/CustomCommand'

export default class Deps extends CustomCommand {
  static description = 'Deps commands'

  static flags = {
    help: oclifFlags.help({ char: 'h' }),
  }

  async run() {}
}
