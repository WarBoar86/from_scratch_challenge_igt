import { GetStaticProps } from 'next';
import { Head } from 'next/document';
import Link from "next/link";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';
import {FiCalendar, FiUser} from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}: HomeProps) {
  // TODO

    
    return(
      <>
        {/* <Head>
          <title>Title</title>
        </Head> */}

        <main className={styles.container}>
          <div>

            {
              postsPagination &&
                postsPagination.results.map(post =>(
                  <div className={styles.postContainer}>
                    <Link  href={`/post/${post.uid}`}>
                      <a> 
                        <div className={styles.heading}>
                          <strong >{post.data.title}</strong>
                        </div>
                        <div className={styles.subtitle}>
                          <text >{post.data.subtitle}</text>
                        </div>

                        <div className={styles.infoContainer}>
                          <div className={styles.info}>
                            <FiCalendar color="#F8F8F8" size={20}/>
                            <time>{format(
                              new Date(post.first_publication_date),
                              "dd MMM 'de' yyyy",
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
                    </a>
                    </Link >
                  </div>
                ))
            }

            {
              postsPagination?.next_page &&
              <a href={postsPagination.next_page} className={styles.loadMore}>Carregar mais posts</a>
            }

          </div>
        </main>
      </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts',{
    fetch:['posts.title','posts.subtitle', 'posts.author'],
    pageSize: 2
  });//TODO

  // TODO
  console.log('===>', JSON.stringify(postsResponse, null, 2));

  const postsPagination={
    next_page: postsResponse.next_page,
    results: postsResponse.results
  }


  return {
    props: {postsPagination}
  }



};
