export interface Board {
  name: string;
}

export interface Worker {
  name: string;
  type: string;
  skills: string;
  position: string;
}
export interface Edge {
  from: string;
  to: string;
  time: number;
}
