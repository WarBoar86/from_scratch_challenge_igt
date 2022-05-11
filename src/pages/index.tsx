import { GetStaticProps } from 'next';
import  Head  from 'next/head';
import Link from "next/link";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';
import {FiCalendar, FiUser} from 'react-icons/fi';
import router, { useRouter } from 'next/router';;

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';

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



  const [isLoadAll, setIsLoadAll] = useState(false);

  function handleLoadMore(){
    if(postsPagination){
      fetch(postsPagination.next_page)
        .then(response => response.json())
        .then(d => postsPagination.results.push( d.results[0] as Post))
        .then(e => setIsLoadAll(true))
    }
  }

useEffect(()=>{
  setIsLoadAll(false);
},[])

    return(
      <>
        <Head>
          <title>spacetraveling</title>
        </Head>

        <main className={styles.container}>
          <div >

            {
              postsPagination &&
                postsPagination.results.map(post =>(
                  // post &&
                  <div className={styles.postContainer} key={post.data.title}>
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
                    </a>
                    </Link >
                  </div>
                ))
            }

            {
              postsPagination?.next_page && !isLoadAll &&
              <button onClick={handleLoadMore }className={styles.loadMore}>Carregar mais posts</button>
            }
          </div>
        </main>
      </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  // let pageNumber =1;


  let pages =[];

  const postsResponse = await prismic.getByType('posts'
  ,{
    fetch:['posts.title','posts.subtitle', 'posts.author'],
    pageSize:1,

  });//TODO

  // TODO
  // console.log('===>', JSON.stringify(postsResponse,null,2));

  const postsPagination={
    next_page: postsResponse.next_page,
    results: postsResponse.results
  }


  return {
    props: {postsPagination}
  }



};
