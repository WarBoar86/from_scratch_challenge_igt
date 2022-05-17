import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { useEffect, useMemo } from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

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
  let readTime = 0;

  function readingTimeCalculation(){
      const totalWords = post.data.content.reduce((acc1, word)  =>{

        acc1 += 
        (word.heading.split(' ').filter( w => w !== ' ').length) 
        + 
        (word.body.reduce( (acc2 , word2) =>  {
          acc2+= word2.text.split(' ').filter( w => w !== ' ').length
          return acc2
        },0))

        return acc1  
    }, 0);

    const readingWordsAverage= 200;

    const time = Math.ceil( (totalWords/readingWordsAverage))

    return time;
  }

  useMemo(()=>{
    
    readTime = readingTimeCalculation();

  },[])

  return(
    <>
      <Head>
          <title>{post.data.title}</title>
      </Head>

      {
        router.isFallback
        ? <span> Carregando...</span>
        :
        <>

          <img src={post.data.banner.url} alt=""  className={styles.banner}/>

          
          <div className={styles.container}>
            <div className={styles.title}>
            <span >{post.data.title}</span>

          </div>


          <div className={styles.infoContainer}>
              <div className={styles.info}>
                <FiCalendar color="#F8F8F8" size={20}/>
                <time>{format(
                  new Date(post.first_publication_date),
                  "dd MMM yyyy",
                  {
                  locale: ptBR,

                  }
                )}</time>
              </div>
              <div className={styles.info}>
                <FiUser color="#F8F8F8" size={20} />
                <span >{post.data.author}</span>
              </div>
              <div className={styles.info}>
                <FiClock color="#F8F8F8" size={20} />
                <span > {`${readTime} min`}</span>
              </div>
          </div>

          {
      
            
            post.data.content.map( p => {

              return(
                <div key={p.heading}>
                <div className={styles.heading}> {p.heading}</div> 
              <div className={styles.postBody}  dangerouslySetInnerHTML={{__html: RichText.asHtml(p.body)}} />
              </div>
              )
            
            })
      
          }

          </div>  
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
  
  // console.log('================>',JSON.stringify(response, null, 2));

  // TODO
  const post ={
    uid: response.uid,
    first_publication_date: response.first_publication_date,
  data: {
    title: response.data.title,
    subtitle: response.data.subtitle,
    author: response.data.author,
    banner:response.data.banner,
    content: response.data.content
   }
  } 
  return{
    props:{post}
  }
};
