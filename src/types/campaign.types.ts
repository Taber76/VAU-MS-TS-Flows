export interface Node {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: any;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: string;
}



export interface Campaign {
  id: string;
  title: string;
  description: string;
  active: 0 | 1;
  user_id: string;
  nodes: Node[];
  edges: Edge[];
  cover_video: 0 | 1;
  cover_image: string;
  created_at: Date;
  updated_at: Date;
}