//for license and copyright see https://github.com/jsutil37/jsutil
//our own code to display diff between 2 files etc.

//reference: https://en.wikipedia.org/wiki/Longest_common_subsequence_problem#Computing_the_length_of_the_LCS
window.llcs = function (s1, s2) {
	let m = s1.length;
	let n = s2.length;
	let c = new Array(m + 1);

	for (let i = 0; i <= m; i++) {
		c[i] = new Array(n + 1);
		c[i][0] = 0;
	}
	for (let j = 0; j <= n; j++) { c[0][j] = 0; }
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
				c[i][j] = c[i - 1][j - 1] + 1;
			} else {
				c[i][j] = Math.max(c[i][j - 1], c[i - 1][j]);
			}
		}
	}
	return c[m][n];
}
