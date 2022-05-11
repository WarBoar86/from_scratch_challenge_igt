import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiCalendar, FiUser } from 'react-icons/fi';

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

          <img src={post.data.banner.url} alt=""  className={styles.banner}/>

          
          <div className={styles.container}>
            <div className={styles.title}>
            <text >{post.data.title}</text>

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
                            <text >{post.data.author}</text>
                            </div>
            </div>

            <div >
                  {
                    post.data.content.map(p =>
                      <div key={p.heading} className={styles.sectionContainer}>
                        <div className={styles.heading}>
                          {p.heading}
                        </div>

                          <div className={styles.postBody}>
                            {p.body.map(b => <div>{b.text}</div>)}
                          </div>
                        
                        </div>
                    )
                  }

            </div>
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
  
  // console.log('================>',JSON.stringify(response.data.content, null, 2));

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
