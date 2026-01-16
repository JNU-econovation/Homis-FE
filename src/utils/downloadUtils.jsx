export function getFileName(contentDisposition) {
    if (!contentDisposition) return null;

    const fileNameRegex = /filename\*\s*=\s*([^;]+)/i; // filename*= 뒤의 내용만 떼기 위한 정규식
    const match = contentDisposition.match(fileNameRegex);

    if (match) {
        const encodedFileName = match[1].replace(/UTF-\d+''/i, ''); // UTF-8'' 등 제거

        return decodeURIComponent(encodedFileName); // 인코딩 된 이름을 디코딩해서 ret
    }
    return null;
}

export function triggerDownload(blob, fileName) {
    const url = URL.createObjectURL(blob); // 임시 url 생성 -> 브라우저가 인식 가능

    const link = document.createElement('a'); // a 태그를 link란 이름으로 생성
    link.href = url; // href는 blob에서 생성한 url 객체
    link.download = fileName; // 파일명 설정

    document.body.appendChild(link); // a 태그(=link)를 DOM에 붙임
    link.click(); // 다운로드 트리거

    // 자원 해제
    link.remove();
    URL.revokeObjectURL(url);
}

export function checkParams(dataId, title) {
    if (!dataId) {
        alert('도안 ID가 존재하지 않습니다.');
        return false;
    }

    if (!title) {
        alert('도안 이름이 존재하지 않습니다.');
        return false;
    }
    return true;
}