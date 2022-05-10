import { GetStaticProps } from 'next';
import { Head } from 'next/document';
import Link from "next/link";
import { getPrismicClient } from '../services/prismic';

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

        <main>
          <div>

            {
              postsPagination &&
                postsPagination.results.map(post =>(
                  <Link  href={`/post/${post.uid}`}>
                    <a> 
                      <strong>{post.data.title}</strong>
                      <text>{post.data.subtitle}</text>
                      <time>{post.first_publication_date}</time>
                      <text>{post.data.author}</text>
                  </a>
                  </Link >
                ))
            }

            {
              postsPagination?.next_page &&
              <a href={postsPagination.next_page}>Carregar mais posts</a>
            }

          </div>
        </main>
      </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts',{
    fetch:['posts.title','posts.subtitle'],
    pageSize: 1
  });//TODO

  // TODO

  console.log('===>', postsResponse);

  const postsPagination={
    next_page: postsResponse.next_page,
    results: postsResponse.results
  }


  return {
    props: {postsPagination}
  }



};
