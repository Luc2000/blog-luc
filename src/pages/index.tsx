import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Link from "next/link";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import { AiOutlineCalendar, AiOutlineUser } from "react-icons/ai";
import { Content } from '../styles/styles.global';
import { MainPost } from './styles.home';
import { useState } from 'react';
import Head from 'next/head';


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

export default function Home({ postsPagination }:HomeProps ): JSX.Element {
  const [mainPosts, setMainPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = async (): Promise<void> => {
    if(currentPage !== 1 && nextPage === null){
      return;
    }

    const postResults = await fetch(`${nextPage}`).then(response => 
      response.json()
    );

    const newPosts = (postResults.results).map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        }
      }
    });

    setNextPage(postResults.next_page);
    setCurrentPage(postResults.page)
    setMainPosts(mainPosts.concat(newPosts));
  }

  return(
    <>
      <Head>
        <title>BenioBlog</title>
      </Head>
      <Content>
        {mainPosts.map(post => {
          return(
            <MainPost key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a key={post.uid}>
                  <h2><b>{post.data.title}</b></h2>
                  <p className="subtitle">{post.data.subtitle}</p>
                  <div className="info">
                    <div>
                      <AiOutlineCalendar />
                      <p>
                        {format(new Date(post.first_publication_date), 'dd MMM yyyy', { 
                          locale:ptBR
                        })}
                      </p>
                    </div>
                    <div>
                      <AiOutlineUser />
                      <p>{post.data.author}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </MainPost>
          )})
        }
        {
          nextPage &&( 
            <p className="loadMore" onClick={handleNextPage}><b>Carregar mais posts</b></p>
          )
        }
      </Content>
    </>
  )
}

export const getStaticProps:GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 1,
    page: 1
  });


  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts
  }

  return {
    props: {
      postsPagination
    }
  }
};
