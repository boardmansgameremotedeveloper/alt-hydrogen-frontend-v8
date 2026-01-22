import type {MetaFunction} from 'react-router';

import '../styles/pages/hello.css';

export const meta: MetaFunction = () => {
  return [{title: 'Hello'}];
};

export default function AboutPage() {
  return (
    <div className="hello-page">
      <h1>About world</h1>
    </div>
  );
}
