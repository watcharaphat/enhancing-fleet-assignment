#include <iostream>
#include <algorithm>
using namespace std;
 
// A job has start time, finish time and profit.
struct Job
{
    int start, finish, profit;
};
 
bool jobComparataor(Job s1, Job s2)
{
    return (s1.finish < s2.finish);
}
 
int latestNonConflict(Job arr[], int i)
{
    for (int j=i-1; j>=0; j--)
    {
        if (arr[j].finish <= arr[i-1].start)
            return j;
    }
    return -1;
}
 
int findMaxProfitRec(Job arr[], int n)
{
    // Base case
    if (n == 1) return arr[n-1].profit;
 
    // Find profit when current job is inclueded
    int inclProf = arr[n-1].profit;
    int i = latestNonConflict(arr, n);
    if (i != -1)
      inclProf += findMaxProfitRec(arr, i+1);
 
    // Find profit when current job is excluded
    int exclProf = findMaxProfitRec(arr, n-1);
 
    return max(inclProf,  exclProf);
}
 
int findMaxProfit(Job arr[], int n)
{
    // Sort jobs according to finish time
    sort(arr, arr+n, jobComparataor);
 
    return findMaxProfitRec(arr, n);
}