import { v4 as uuidv4 } from 'uuid';
import { type Node, type Edge } from "../types/campaign.types";

export default class CampaignHelper {

  public static async defaultNodesAndEdges() {
    const node0_id = uuidv4();
    const node1_id = uuidv4();
    const nodes: Node[] = [
      {
        id: node0_id,
        type: 'startUpdater',
        position: { x: 0, y: 0 },
        data: {
          name: '',
          ref: { nextNode: node1_id }
        }
      },
      {
        id: node1_id,
        type: 'endUpdater',
        position: { x: 300, y: 0 },
        data: {
          name: '',
          ref: { prevNode: node0_id },
          answer: {
            type: 'buttonCta ',
            data: {
              id: node1_id,
              text: 'Próximo video',
              bgColor: '#000000',
              textColor: '#ffffff',
            }
          },
        }
      }
    ]
    const edges: Edge[] = [
      {
        id: uuidv4(),
        source: node0_id,
        target: node1_id,
        type: 'buttonedge'
      },
    ];
    return { nodes, edges };

  }

}