import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}:PostProps) {
  // TODO

  const router = useRouter();

  return(
    <>

      {
        router.isFallback
        ? <text> Carregando...</text>
        :
        <>
          <text>{post ? post.data.title: '...'}</text>
          <img src={post.data.banner.url} alt="" />
        </>
      }

      
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');//TODO


  
  // TODO
  const paths = posts.results.map(p => {
    return { params: { slug: p.uid }}
  }
  );

  return {
    paths: paths,
    fallback: true

  }


};

export const getStaticProps: GetStaticProps = async ({params}) => {

  const {slug} = params;
  
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts',String(slug));//TODO
  
  console.log('================>',JSON.stringify(response, null, 2));

  // TODO
  const post ={
    first_publication_date: response.first_publication_date,
  data: {
    title: response.data.title,
    banner:response.data.banner,
    author: response.data.author,
    content: response.data.content,// {
   }
  } 
  return{
    props:{post}
  }
};
