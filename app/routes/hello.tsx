import type {MetaFunction} from 'react-router';

import '../styles/pages/hello.css';

export const meta: MetaFunction = () => {
  return [{title: 'Hello'}];
};

export default function HelloPage() {
  return (
    <div className="hello-page">
      <h1>Hello world</h1>
    </div>
  );
}
