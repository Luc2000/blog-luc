import styled from "styled-components";

export const PostContent = styled.div`
    .banner{
        width: 100%;
        display: block;
        background-size:cover;
        height: 400px;
    }

    p{
        color: var(--gray-500);
    }

    .heading{
        margin-bottom: 2rem
    }

    .info{
        margin: 2rem 0
    }

    article p {
        margin: 15px 0;
        text-align: justify;
    }

    article p strong{
        font-size: 1.5rem;
        margin-top:50px
    }

`;